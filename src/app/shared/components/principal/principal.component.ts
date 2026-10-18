import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  @Input() secciones: any[] = [];
  @Input() titulo: string = '';

  @Input() modo: string = '';


  seccionActiva: string = '';

  // Estado para los modales
  mostrarModalSeccion = false;
  mostrarModalGrupo = false;
  mostrarModalItem = false;
  mostrarModalUpload = false;
  mostrarModalImportTelegram = false;

  grupoSeleccionado = '';

  // Campos de los formularios
  nombreNuevaSeccion = '';
  nombreNuevoGrupo = '';
  linkNuevoItem = '';
  urlTelegram: string = '';
  // Texto de búsqueda
  busqueda: string = '';

  // Categoría seleccionada
  categoriaSeleccionada: string = '';

  // Categorías dinámicas basadas en los items recibidos
  get categorias(): string[] {
    const todas = this.secciones.flatMap(sec =>
      sec.grupos.flatMap((g: any) =>
        g.items.map((item: any) => item.categoria)
      )
    );
    return Array.from(new Set(todas)); // elimina duplicados
  }

  // Método para limpiar filtros
  limpiarFiltros() {
    this.busqueda = '';
    this.categoriaSeleccionada = '';
  }

  // Items filtrados según búsqueda y categoría
  get itemsFiltrados() {
    return this.secciones.flatMap(sec =>
      sec.grupos.flatMap((g: any) =>
        g.items.filter((item: any) =>
          (!this.busqueda || item.nombre.toLowerCase().includes(this.busqueda.toLowerCase())) &&
          (!this.categoriaSeleccionada || item.categoria === this.categoriaSeleccionada)
        )
      )
    );
  }

  ngOnInit() {
    if (this.secciones.length > 0) {
      this.seccionActiva = this.secciones[0].nombre;
    }
  }

  constructor(private http: HttpClient) { }

  cambiarSeccion(tipo: 'videos' | 'libros' | 'articulos') {
    this.seccionActiva = tipo;
  }

  // Funciones para agregar nueva sección
  abrirModalSeccion() {
    this.mostrarModalSeccion = true;
    this.nombreNuevaSeccion = '';
  }

  cerrarModalSeccion() {
    this.mostrarModalSeccion = false;
    this.nombreNuevaSeccion = '';
  }

  agregarNuevaSeccion() {
    if (this.nombreNuevaSeccion.trim() && !this.secciones.find(s => s.nombre.toLowerCase() === this.nombreNuevaSeccion.toLowerCase())) {
      this.secciones.push({
        nombre: this.nombreNuevaSeccion,
        grupos: []
      });
      this.seccionActiva = this.nombreNuevaSeccion.toLowerCase() as any;
      this.cerrarModalSeccion();
    }
  }

  // Funciones para agregar nuevo grupo
  abrirModalGrupo() {
    this.mostrarModalGrupo = true;
    this.nombreNuevoGrupo = '';
  }

  cerrarModalGrupo() {
    this.mostrarModalGrupo = false;
    this.nombreNuevoGrupo = '';
  }

  agregarNuevoGrupo() {
    if (this.nombreNuevoGrupo.trim()) {
      const seccion = this.secciones.find(s => s.nombre === this.seccionActiva);
      if (seccion) {
        seccion.grupos.push({
          nombre: this.nombreNuevoGrupo,
          items: []
        });
      }
      this.cerrarModalGrupo();
      this.nombreNuevoGrupo = '';
    }
  }


  // Funciones para agregar nuevo item
  abrirModalItem(nombreGrupo: string) {
    this.mostrarModalItem = true;
    this.grupoSeleccionado = nombreGrupo;
    this.linkNuevoItem = '';
  }

  cerrarModalItem() {
    this.mostrarModalItem = false;
    this.grupoSeleccionado = '';
    this.linkNuevoItem = '';
  }

  agregarNuevoItem() {
    const link = this.linkNuevoItem.trim();
    if (link && this.grupoSeleccionado) {
      // 1. Buscar la sección activa directamente
      const seccion = this.secciones.find(s => s.nombre === this.seccionActiva);
      if (!seccion) return;

      // 2. Buscar el grupo real dentro de esa sección
      const grupo = seccion.grupos.find((g: any) => g.nombre === this.grupoSeleccionado);
      if (!grupo) return;

      // 3. Procesar link de YouTube si es necesario
      let linkProcesado = link;
      if (link.includes('youtube.com/watch?v=')) {
        linkProcesado = link.replace('watch?v=', 'embed/');
      } else if (link.includes('youtu.be/')) {
        const videoId = link.split('youtu.be/')[1].split('?')[0];
        linkProcesado = `https://www.youtube.com/embed/${videoId}`;
      }

      // 4. Insertar en el array real
      grupo.items.push({ link: linkProcesado });

      // 5. Reset modal
      this.cerrarModalItem();
      this.linkNuevoItem = '';
    }
  }
  agregarNuevoTiktok() {
    const link = this.linkNuevoItem
    if (link) {
      // 1. Buscar la sección activa directamente
      const seccion = this.secciones.find(s => s.nombre === this.seccionActiva);
      if (!seccion) return;

      // 2. Buscar el grupo real dentro de esa sección
      const grupo = seccion.grupos.find((g: any) => g.nombre === this.grupoSeleccionado);
      if (!grupo) return;

      // Llama a oEmbed de TikTok
      this.http.get<any>(`https://www.tiktok.com/oembed?url=${link}`).subscribe({
        next: (data) => {
          const nuevoItem = {
            link: link,
            thumb: data.thumbnail_url,
            titulo: data.title,
            autor: data.author_name,
            tags: [],
            views: '0',
            duration: '--:--'
          };

          // 👇 actualizamos inmutablemente para que Angular detecte cambios
          grupo.items = [...grupo.items, nuevoItem];
          console.log('TikTok agregado:', nuevoItem);
        },
        error: (err) => {
          console.error('Error al obtener datos de TikTok:', err);
        }
      });


      const cleanUrl = link.split("?")[0];
      this.http.get<any>(`${environment.backendUrl}/api/tiktok?url=${cleanUrl}`).subscribe({
        next: (data) => {
          const nuevoItem = {
            link: link,
            thumb: data.thumbnail,
            titulo: data.titulo,
            autor: data.autor,
            musica: data.musica,
            tags: data.tags,
            views: data.stats.playCount,
            duration: data.duracion + 's'
          };
          console.log(nuevoItem)
        },
        error: (err) => console.error(err)
      });

      this.cerrarModalItem();
      this.linkNuevoItem = '';
    }
  }


  // Obtener las secciones dinámicamente para el template
  get seccionesDisponibles() {
    return this.secciones.map(s => s.nombre);
  }

  // Obtener los grupos de la sección activa
  get gruposSeccionActiva() {
    return this.secciones.find(s => s.nombre === this.seccionActiva)?.grupos || [];
  }

  // Función para obtener el tipo de sección (para mostrar íconos)
  getTipoSeccion(seccion: string): 'videos' | 'libros' | 'articulos' | 'custom' {
    if (seccion === 'videos' || seccion === 'libros' || seccion === 'articulos') {
      return seccion as 'videos' | 'libros' | 'articulos';
    }
    return 'custom';
  }

  /* ---------------- upload (archivos locales) ---------------- */
  abrirModalUpload(nombreGrupo: string) {
    this.grupoSeleccionado = nombreGrupo;
    this.mostrarModalUpload = true;
  }
  cerrarModalUpload() {
    this.mostrarModalUpload = false;
    this.grupoSeleccionado = '';
  }
  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || !this.grupoSeleccionado) return;
    this.procesarArchivos(files);
  }
  private procesarArchivos(files: FileList) {
    const seccion = this.secciones.find(s => s.nombre === this.seccionActiva);
    if (!seccion) return;
    const grupo = seccion.grupos.find((g: any) => g.nombre === this.grupoSeleccionado);
    if (!grupo) return;

    Array.from(files).forEach((file: File) => {
      if (!this.esArchivoValido(file)) return;

      const nombreSinExt = file.name.replace(/\.[^/.]+$/, '');

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const nuevoItem = {
          nombre: nombreSinExt,
          categoria: 'Subido',
          link: e.target.result, // 🔹 base64 para mostrar como <img>
          preview: e.target.result,
          mimeType: file.type,
          usos: 0
        };
        grupo.items = [...grupo.items, nuevoItem];
        grupo.cantidad = grupo.items.length;
      };
      reader.readAsDataURL(file); // 🔹 convierte a base64
    });

    this.cerrarModalUpload();
  }

  private esArchivoValido(file: File): boolean {
    const permitidos = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const max = 5 * 1024 * 1024;
    if (!permitidos.includes(file.type)) {
      // aquí podrías notificar al usuario
      return false;
    }
    if (file.size > max) {
      return false;
    }
    return true;
  }

  /* ---------------- import Telegram (simulado) ---------------- */
  abrirModalImportTelegram(nombreGrupo: string) {
    this.grupoSeleccionado = nombreGrupo;
    this.mostrarModalImportTelegram = true;
    this.urlTelegram = '';
  }
  cerrarModalImportTelegram() {
    this.mostrarModalImportTelegram = false;
    this.grupoSeleccionado = '';
    this.urlTelegram = '';
  }
  importarDeTelegram() {
    if (!this.urlTelegram || !this.grupoSeleccionado) {
      this.cerrarModalImportTelegram();
      return;
    }

    const seccion = this.secciones.find(s => s.nombre === this.seccionActiva);
    if (!seccion) return;
    const grupo = seccion.grupos.find((g: any) => g.nombre === this.grupoSeleccionado);
    if (!grupo) return;

    // extraer nombre corto del set desde la URL
    const shortName = this.urlTelegram.split("/").pop();

    fetch(`${environment.backendUrl}/api/stickers/${shortName}`)
      .then(res => res.json())
      .then(data => {
        console.log("📥 Respuesta del backend:", data);
        // 👀 Log/alert para debug
        /* if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          alert("📥 Respuesta backend (primeros 200 chars):\n" + JSON.stringify(data).substring(0, 200));
        } else {
          console.log("📥 Respuesta del backend:", data);
        } */

        data.stickers.forEach((s: any) => {
          let nuevo;
          if (s.type === 'tgs') {
            nuevo = {
              nombre: s.emoji || "Sticker",
              categoria: "Telegram",
              animationData: s.animationData,
              link: null,      // 👈 agregamos link vacío
              usos: 0
            };

            console.log('Antes:', grupo.items);
            grupo.items = [...grupo.items, nuevo];
            console.log('Después:', grupo.items);

          } else {
            nuevo = {
              nombre: s.emoji || "Sticker",
              categoria: "Telegram",
              link: s.fileUrl,
              animationData: null, // 👈 agregamos anim vacía
              usos: 0
            };
            console.log('Antes:', grupo.items);
            grupo.items = [...grupo.items, nuevo];
            console.log('Después:', grupo.items);
          }
          /* if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            alert("➡️ Nuevo item:\n" + JSON.stringify(nuevo).substring(0,200));
          } else {
            console.log("➡️ Nuevo item:", nuevo);
          } */
        });
        this.cerrarModalImportTelegram();
      });
  }
}
