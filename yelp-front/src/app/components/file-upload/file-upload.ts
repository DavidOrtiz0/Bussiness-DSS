import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, UploadResult, Collection } from '../../services/api.service';

type Status = 'pendiente' | 'ok' | 'error';
type Step = { key: Collection; label: string; status: Status; msg?: string; file?: File };

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css'],
})
export class FileUpload {
  constructor(private api: ApiService, private router: Router) {}

  view = signal<'menu' | 'wizard'>('menu');
  connecting = false;
  uploading = false;

  steps = signal<Step[]>([
    { key: 'business', label: 'business.json', status: 'pendiente' },
    { key: 'review',   label: 'review.json',   status: 'pendiente' },
    { key: 'user',     label: 'user.json',     status: 'pendiente' },
    { key: 'tip',      label: 'tip.json',      status: 'pendiente' },
    { key: 'checkin',  label: 'checkin.json',  status: 'pendiente' },
  ]);

  allDone = computed(() => this.steps().every(s => s.status === 'ok'));

  pickUpload() {
    this.view.set('wizard');
    this.api.mode.set('upload');
  }

  pickConnect() {
    this.connecting = true;
    this.api.connectToApi().subscribe(ok => {
      this.connecting = false;
      if (ok) {
        this.api.mode.set('api');
        this.router.navigateByUrl('/dashboard');
      } else {
        alert('No se pudo conectar con la API');
      }
    });
  }

  onFileChange(step: Step, ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    step.file = file; step.status = 'pendiente'; step.msg = undefined;
    this._refresh();
  }

  goDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  send(step: Step) {
    if (!step.file) { this._mark(step, 'error', 'Seleccione un archivo'); return; }
    if (!step.file.name.toLowerCase().endsWith('.json')) {
      this._mark(step, 'error', 'Solo se acepta .json'); return;
    }
    this.uploading = true;
    this._mark(step, 'pendiente', 'Subiendo…');

    this.api.upload(step.key, step.file).subscribe((res: UploadResult) => {
      this.uploading = false;
      if (res.ok) this._mark(step, 'ok', 'Cargado y validado');
      else this._mark(step, 'error', res.error || 'Error al validar');
    });
  }

  // helpers
  private _mark(step: Step, status: Status, msg?: string) {
    step.status = status; step.msg = msg; this._refresh();
  }
  private _refresh() { this.steps.update(v => [...v]); }
}
