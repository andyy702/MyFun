import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  items = [
    {
      name: 'Memes',
      icon: 'assets/icons/meme.jpg',
      link: 'stickers-memes'
    },
    {
      name: 'Stickers',
      icon: 'assets/icons/sticker.jpg',
      link: 'https://drive.google.com/drive/folders/TUS_STICKERS'
    },
    {
      name: 'Creativo',
      icon: 'assets/icons/creativo.jpg',
      link: 'https://miro.com/welcomeonboard/QWlSNGtNblZoOTM0UzJxYmVqN0w0ZEI5M3IydFFObGt0TXdxaC9Tb1VacjRtSzl4bER2OWxGNCtXbGVmV0ZKU0tlVmNWV1RzTXNMTEp1Sm9KK0MwVEgrKzhPcGxIck1DWEJtaVB5VVYycCt1TnJ4ZUd3N0l6MStjV0dWM3FEM0N3VHhHVHd5UWtSM1BidUtUYmxycDRnPT0hdjE=?share_link_id=655687849199'
    },
    {
      name: 'electronica',
      icon: 'assets/icons/electronica.jpg',
      link: ''
    },
    {
      name: 'Gym',
      icon: 'assets/icons/gym.jpg',
      link: ''
    },
  
    {
      name: 'Videojuegos',
      icon: 'assets/icons/videojuegos.png',
      link: ''
    },
    {
      name: 'PeliSeri',
      icon: 'assets/icons/peliseri.png',
      link: ''
    },
    {
      name: 'Spotify',
      icon: 'assets/icons/spotify.png',
      link: 'https://open.spotify.com/collection/playlists'
    },
    {
      name: 'TikTok',
      icon: 'assets/icons/tiktok.jpg',
      link: '/tiktok'
    },
    
    {
      name: 'Mate',
      icon: 'assets/icons/mate.jpg',
      link: '/mates'
    }
  ];

  constructor(private router: Router) {}

  goTo(url: string) {
    if (url.startsWith('http')) {
      // Si es un enlace externo
      window.open(url, '_blank');
    } else {
      // Si es una ruta interna de Angular
      this.router.navigate([url]);
    }
  }
}
