import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StickerItem, GrupoSticker, SeccionSticker, UploadedFile } from './interfaces/stickers.interface';
import { StickersMemeService } from './services/stickers-memes.service';
import { NotificationService } from '../../shared/services/notification.service';
import { StorageService } from '../../shared/services/storage.service';


interface Grupo {
  nombre: string;
  descripcion: string;
  usos: number;
}

@Component({
  selector: 'app-stickers-memes',
  templateUrl: './stickers-memes.component.html',
  styleUrls: ['./stickers-memes.component.css']
})
export class StickersMemesComponent {
  busqueda = '';
  categoria = '';

  secciones = [
    {
      nombre: 'Memes',
      grupos: [
        {
          nombre: 'Random',
          items: [
            { link: '😂', nombre: 'Meme 1', categoria: 'humor', usos: 10 },
            { link: '🤣', nombre: 'Meme 2', categoria: 'humor', usos: 5 }
          ]
        }
      ]
    },
    {
      nombre: 'Stickers',
      grupos: [
        {
          nombre: 'Favoritos',
          items: [
            { link: '🔥', nombre: 'Sticker 1', categoria: 'cool', usos: 20 }
          ]
        }
      ]
    }
  ];

  limpiarFiltros() {
    this.busqueda = '';
    this.categoria = '';
  }
}