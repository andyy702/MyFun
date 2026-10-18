import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnimationOptions } from 'ngx-lottie';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnChanges, AfterViewInit {
  private _item!: { link: string };
  safeUrl: SafeResourceUrl | null = null;
  @Input() modo: string = '';

  @Input()
  set item(value: any) {
    this._item = value;
    this.updateSafeUrl();

  }
  get item() { return this._item; }

  @Input() seccionActiva: string = '';

  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  lottieOptions: any;

  private alreadyProcessed = false;

  constructor(private sanitizer: DomSanitizer, private el: ElementRef,private http: HttpClient) {

  }



  ngAfterViewInit() {
    if (this.modo === 'tiktok') {
      this.injectTikTokScript();
    }
  }

  private injectTikTokScript() {
    // Elimina scripts anteriores para evitar duplicados
    const oldScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (oldScript) {
      oldScript.remove();
    }

    // Crea un nuevo script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;

    // Inyecta después del bloque actual
    this.el.nativeElement.appendChild(script);
  }

  extraerVideoId(link: string): string {
    const match = link.match(/video\/(\d+)/);
    return match ? match[1] : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item?.link && this.esYoutube(this.item.link)) {
      const url = this.transformYoutube(this.item.link);

      // Limpia primero para que Angular destruya el iframe
      this.safeUrl = null;

      setTimeout(() => {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        console.log('🎥 SafeUrl asignado (móvil):', this.safeUrl);
      }, 50);
    }
  }



  private transformYoutube(link: string): string {
    let videoId = '';

    if (link.includes('youtube.com/watch')) {
      const url = new URL(link);
      videoId = url.searchParams.get('v') || '';
    } else if (link.includes('youtu.be/')) {
      videoId = link.split('youtu.be/')[1];
    } else if (link.includes('embed/')) {
      videoId = link.split('embed/')[1];
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }


  ngOnInit() {

    


    // Detecta si es móvil
    if (this.item.animationData) {
      this.lottieOptions = {
        animationData: this.item?.animationData || null,
        loop: true,
        autoplay: true,
        renderer: this.isMobile ? 'canvas' : 'svg' // 👈 PC usa svg, móvil usa canvas
      };
    }

    console.log("Item recibidoooo:", this.item);
    if (this.item?.link?.includes("youtube.com")) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.item.link);
      console.log("SafeUrl asignado:", this.safeUrl);
    }

    this.updateSafeUrl();
    /* if (this.isMobile) {
      try {
        alert('Sticker recibido:\n' + JSON.stringify(this.item).substring(0, 200));
      } catch (e) {
        alert('Sticker recibido (sin stringify)');
      }
    } else {
      console.log('Sticker recibido en item:', this.item);
    } */

  }


  getSafeYoutubeUrl(link: string): SafeResourceUrl {
    let videoId = "";
    if (link.includes("youtu.be/")) {
      videoId = link.split("youtu.be/")[1].split("?")[0];
    } else if (link.includes("v=")) {
      videoId = link.split("v=")[1].split("&")[0];
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  updateSafeUrl() {
    if (this._item?.link && this.esYoutube(this._item.link)) {
      let embedUrl = this._item.link;

      // convertir todos los casos a formato embed
      if (embedUrl.includes('watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/');
      }
      if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeUrl = null;
    }
  }


  esYoutube(link?: string): boolean {
    if (!link) return false;   // si no hay link, no intentes usar includes
    return link.includes("youtube.com") || link.includes("youtu.be");
  }


  // Soporta: watch?v=, youtu.be/, embed/, shorts/, m.youtube.com, + query params raros
  private extraerYoutubeId(url: string): string {
    // Normaliza dominio móvil
    url = url.replace('m.youtube.com', 'www.youtube.com');

    // shorts
    const shorts = url.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
    if (shorts?.[1]) return shorts[1];

    // youtu.be
    const yb = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (yb?.[1]) return yb[1];

    // watch?v=
    const wv = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (wv?.[1]) return wv[1];

    // embed/
    const em = url.match(/embed\/([A-Za-z0-9_-]{11})/);
    if (em?.[1]) return em[1];

    return '';
  }

  // (tus otros helpers)
  esLibro(link: string | undefined) { return !!link && link.includes('books.google'); }
  esArticulo(link: string | undefined) { return !!link && link.includes('sciencedirect.com'); }
  esPDF(link: string | undefined) { return !!link && link.toLowerCase().endsWith('.pdf'); }
  getPortadaLibro(link: string) {
    const m = link.match(/id=([^&]+)/);
    return m
      ? `https://books.google.com/books/content?id=${m[1]}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
      : 'assets/img/book-placeholder.png';
  }
  getPortadaArticulo(_: string) { return 'assets/img/article-placeholder.png'; }
}
