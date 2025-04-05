import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastSignal = signal<{ message: string; type: 'success' | 'error'; duration?: number } | null>(null);

  showToast(message: string, type: 'success' | 'error', duration = 3000) {
    this.toastSignal.set({ message, type, duration });

    setTimeout(() => {
      this.toastSignal.set(null);
    }, duration);
  }
}
