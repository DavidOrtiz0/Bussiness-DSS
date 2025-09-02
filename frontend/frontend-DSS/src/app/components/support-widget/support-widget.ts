import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './support-widget.css',
  template: `
  <div class="support-overlay" *ngIf="support.panelOpen()" (click)="afterSend()">
      <div class="support-panel neu-card p-3"
           role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <div class="support-header d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Soporte y Reporte</h6>
          <button class="btn btn-sm btn-outline-secondary" (click)="afterSend()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
    <div class="row g-2">
      <div class="col-12">
        <label class="form-label small">Para</label>
        <input class="form-control"
              [(ngModel)]="to"
              (input)="showWarn=false"
              placeholder="soporte@tudominio.com"
              [class.is-invalid]="showWarn && !isEmail(to)">
        <div class="invalid-feedback">Correo inválido.</div>
      </div>
      <div class="col-12">
        <label class="form-label small">Asunto</label>
        <input class="form-control" [(ngModel)]="title" (input)="showWarn=false"
              placeholder="Error al usar el dashboard">
      </div>
      <div class="col-6">
        <label class="form-label small">Severidad</label>
        <select class="form-select" [(ngModel)]="severity">
          <option>Alta</option><option>Media</option><option>Baja</option>
        </select>
      </div>
      <div class="col-6">
        <label class="form-label small">Módulo</label>
        <select class="form-select" [(ngModel)]="module">
          <option>Dashboard</option><option>Upload</option><option>Análisis</option><option>Navegación</option>
        </select>
      </div>
      <div class="col-12">
        <label class="form-label small">Descripción</label>
        <textarea class="form-control" rows="3" [(ngModel)]="desc" (input)="showWarn=false"
                  placeholder="Qué esperabas que pasara y qué pasó"></textarea>
      </div>
      <div class="col-12">
        <label class="form-label small">Pasos para reproducir</label>
        <textarea class="form-control" rows="3" [(ngModel)]="steps" (input)="showWarn=false"
                  placeholder="1) Abrir ... 2) Seleccionar ... 3) ..."></textarea>
      </div>
      <div class="col-12" *ngIf="showWarn && !canSend">
        <div class="text-danger small">
          Debes ingresar un correo válido y al menos Asunto, Descripción o Pasos.
        </div>
      </div>
  <div class="col-12 d-flex gap-2 mt-2">
    <a class="btn btn-primary"
       [attr.href]="canSend ? mailto() : null"
       [class.disabled]="!canSend"
       (click)="handleSend($event)">
       Enviar correo
    </a>
    <button class="btn btn-outline-secondary"
            type="button"
            [disabled]="!canSend"
            (click)="handleDownload()">
      Descargar TXT
    </button>
  </div>
  `,
})
export class SupportWidget {
  public support = inject(SupportService);

  to = 'desprogramadores@gmail.com';
  title = '';
  severity = 'Media';
  module = 'Dashboard';
  desc = '';
  steps = '';
  copied = false;

  private subject(){ return `[DSS][${this.severity}][${this.module}] ${this.title || 'Reporte'}`; }
  private body(){ return [
      `Módulo: ${this.module}`,
      `Severidad: ${this.severity}`,
      ``,
      `Descripción:`,
      `${this.desc || '(sin descripción)'}`,
      ``,
      `Pasos para reproducir:`,
      `${this.steps || '(sin pasos)'}`
    ].join('\n');
  }

  mailto(){
    return `mailto:${encodeURIComponent(this.to)}?subject=${encodeURIComponent(this.subject())}&body=${encodeURIComponent(this.body())}`;
  }

  download(){
    const blob = new Blob([`${this.subject()}\n\n${this.body()}`], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reporte-soporte-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.txt`;
    a.click(); URL.revokeObjectURL(a.href);
  }

  private resetForm(){
  this.to = 'desprogramadores@gmail.com';
  this.title = '';
  this.severity = 'Media';
  this.module = 'Dashboard';
  this.desc = '';
  this.steps = '';
  this.copied = false;
}

afterSend(){
  setTimeout(() => {
    this.resetForm();
    this.support.closePanel();
  }, 0);
}

// ↓ Validaciones 
isEmail(v: string){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
private hasContent(){ return !!(this.title.trim() || this.desc.trim() || this.steps.trim()); }
get canSend(){ return this.isEmail(this.to) && this.hasContent(); }

showWarn = false;

handleSend(ev: Event){
  if(!this.canSend){ ev.preventDefault(); this.showWarn = true; return; }
  this.afterSend(); // limpia y cierra
}
handleDownload(){
  if(!this.canSend){ this.showWarn = true; return; }
  this.download();
}

}
