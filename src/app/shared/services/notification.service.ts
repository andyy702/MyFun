import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Aquí puedes integrar Toastr, Angular Material Snackbar, etc.
  }
}
