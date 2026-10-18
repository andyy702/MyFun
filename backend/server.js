import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import zlib from "zlib";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = 3000;

// ⚠️ pon tu token real aquí (NO lo subas a GitHub)
const TOKEN = "8431310356:AAEC0RiKTtBPLFKu29hdxL3EPyywdDlTCV4";

app.use(cors());

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
                    stickerData.fileUrl = fileUrl;
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
