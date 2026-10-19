import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import zlib from "zlib";
import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 3000;

// Variables de entorno (backend/.env en tu PC, panel de Koyeb en producción)
const TOKEN = process.env.TELEGRAM_TOKEN;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

// En producción define ALLOWED_ORIGIN con la URL de Vercel
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));
app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

/* ---------------- Colecciones (Supabase) ---------------- */

const MODOS = ["tiktok", "mates"];
const checkModo = (req, res, next) =>
    MODOS.includes(req.params.modo)
        ? next()
        : res.status(400).json({ error: "Modo inválido" });

app.get("/api/colecciones/:modo", checkModo, async (req, res) => {
    const { rows } = await pool.query(
        `select s.nombre as seccion, g.nombre as grupo, i.id, i.link, i.meta
         from secciones s
         left join grupos g on g.seccion_id = s.id
         left join items i on i.grupo_id = g.id
         where s.modo = $1
         order by s.id, g.id, i.id`,
        [req.params.modo]
    );

    const secciones = [];
    for (const r of rows) {
        let s = secciones.find(x => x.nombre === r.seccion);
        if (!s) secciones.push(s = { nombre: r.seccion, grupos: [] });
        if (!r.grupo) continue;
        let g = s.grupos.find(x => x.nombre === r.grupo);
        if (!g) s.grupos.push(g = { nombre: r.grupo, items: [] });
        if (r.id) g.items.push({ id: r.id, link: r.link, ...r.meta });
    }
    res.json(secciones);
});

app.post("/api/colecciones/:modo/secciones", checkModo, async (req, res) => {
    await pool.query(
        "insert into secciones (modo, nombre) values ($1, $2) on conflict do nothing",
        [req.params.modo, req.body.nombre]
    );
    res.sendStatus(201);
});

app.post("/api/colecciones/:modo/grupos", checkModo, async (req, res) => {
    const { seccion, nombre } = req.body;
    await pool.query(
        `insert into grupos (seccion_id, nombre)
         select id, $3 from secciones where modo = $1 and nombre = $2
         on conflict do nothing`,
        [req.params.modo, seccion, nombre]
    );
    res.sendStatus(201);
});

app.post("/api/colecciones/:modo/items", checkModo, async (req, res) => {
    const { seccion, grupo, link, meta = {} } = req.body;
    const { rows } = await pool.query(
        `insert into items (grupo_id, link, meta)
         select g.id, $4, $5 from grupos g
         join secciones s on s.id = g.seccion_id
         where s.modo = $1 and s.nombre = $2 and g.nombre = $3
         on conflict (grupo_id, link) do update set meta = excluded.meta
         returning *`,
        [req.params.modo, seccion, grupo, link, meta]
    );
    rows.length
        ? res.status(201).json(rows[0])
        : res.status(404).json({ error: "El grupo no existe" });
});

/* ---------------- Telegram ---------------- */

// Sirve archivos de Telegram sin exponer el token al navegador
app.get("/api/file/*path", async (req, res) => {
    const filePath = req.params.path.join("/");
    const r = await fetch(`https://api.telegram.org/file/bot${TOKEN}/${filePath}`);
    if (!r.ok) return res.sendStatus(r.status);
    res.set("Content-Type", r.headers.get("content-type"));
    res.send(Buffer.from(await r.arrayBuffer()));
});

// Obtener stickers de un set
app.get("/api/stickers/:setName", async (req, res) => {
    try {
        const setName = req.params.setName;

        // 1. Info del set
        const response = await fetch(
            `https://api.telegram.org/bot${TOKEN}/getStickerSet?name=${setName}`
        );
        const data = await response.json();

        if (!data.ok) {
            return res.status(400).json({ error: "No se pudo obtener el pack" });
        }

        // 2. Procesar cada sticker
        const stickers = await Promise.all(
            data.result.stickers.map(async (s, i) => {
                // Obtener file_path
                const fileRes = await fetch(
                    `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${s.file_id}`
                );
                const fileData = await fileRes.json();
                const filePath = fileData.result.file_path;
                const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;

                // Detectar tipo según extensión
                const ext = filePath.split(".").pop();

                let stickerData = { id: i + 1, emoji: s.emoji, type: ext };

                if (ext === "tgs") {

                    try {
                        const tgsRes = await fetch(fileUrl);
                        const buffer = Buffer.from(await tgsRes.arrayBuffer());

                        let jsonStr;
                        try {
                            // primero probamos descomprimir como gzip
                            jsonStr = zlib.gunzipSync(buffer).toString();
                        } catch (e) {
                            console.warn("⚠️ No era gzip, usando buffer directo");
                            jsonStr = buffer.toString();
                        }

                        stickerData.animationData = JSON.parse(jsonStr);
                    } catch (err) {
                        console.error("❌ Error procesando .tgs:", err);
                    }
                } else {
                    // URL del propio backend: no incluye el token
                    stickerData.fileUrl = `${PUBLIC_URL}/api/file/${filePath}`;
                }
                console.log(stickerData);
                return stickerData;
            })
        );

        res.json({ name: data.result.name, title: data.result.title, stickers });
    } catch (err) {
        console.error("Error en backend:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/* ---------------- TikTok (scraping, puede fallar en producción) ---------------- */

app.get("/api/tiktok", async (req, res) => {
    try {
        let url = req.query.url;
        if (!url) return res.status(400).json({ error: "Falta el parámetro url" });

        // limpiar parámetros extra
        url = url.split("?")[0];

        const resp = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
                "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
                "Referer": "https://www.tiktok.com/"
            }
        });

        // 👇 revisa que realmente está llegando HTML
        console.log("TikTok status:", resp.status);
        console.log("TikTok headers:", resp.headers["content-type"]);
        console.log("HTML length:", resp.data?.length);

        const $ = cheerio.load(resp.data);
        const script = $("#SIGI_STATE").html();
        if (!script) return res.status(500).json({ error: "No se encontró info" });

        const json = JSON.parse(script);
        const videoData = Object.values(json.ItemModule)[0];
        if (!videoData) return res.status(500).json({ error: "Video no encontrado" });

        res.json({
            id: videoData.id,
            titulo: videoData.desc,
            autor: videoData.author,
            musica: videoData.music?.title || "",
            tags: videoData.textExtra?.map(t => t.hashtagName) || [],
            duracion: videoData.video?.duration || 0,
            thumbnail: videoData.video?.cover || "",
            stats: videoData.stats || {}
        });
    } catch (err) {
        console.error(err.response?.status, err.response?.data || err.message);
        res.status(500).json({ error: err.message });

    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});