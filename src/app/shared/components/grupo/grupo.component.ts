import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GrupoSticker } from 'src/app/modules/stickers-memes/interfaces/stickers.interface';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent {
  @Input() grupo!: GrupoSticker;
  @Input() filtroTexto: string = '';
  @Input() modoVista: 'grid' | 'list' = 'grid';
  @Input() modo: string = '';

  @Output() agregarItem = new EventEmitter<string>();
  @Input() seccionActiva: string = '';
  @Input() nombre: string = '';
  @Input() items: { link: string }[] = [];

  abrirModalItem() {
    this.agregarItem.emit(this.nombre); // nombre del grupo
  }
}
