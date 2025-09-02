import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SupportService {
  panelOpen = signal(false);
  openPanel(){ this.panelOpen.set(true); }
  closePanel(){ this.panelOpen.set(false); }
  togglePanel(){ this.panelOpen.update(v => !v); }
}
