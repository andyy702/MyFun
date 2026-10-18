import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StickersMemeService {
  importarPackTelegram(packName: string): Observable<any> {
    // Simulación de respuesta
    return of({ ok: true, result: { stickers: [] } });
  }
}
