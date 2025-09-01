import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, UploadResult } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';

type Coll = 'business'|'review'|'user'|'tip'|'checkin';
type Step = { key: Coll; label: string; status: 'pendiente'|'ok'|'error'; msg?: string; file?: File };

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUpload {
  constructor(private api: ApiService, private router: Router) {}

  view = signal<'menu'|'wizard'>('menu');

  steps = signal<Step[]>([
    { key:'business', label:'business.json', status:'pendiente' },
    { key:'review',   label:'review.json',   status:'pendiente' },
    { key:'user',     label:'user.json',     status:'pendiente' },
    { key:'tip',      label:'tip.json',      status:'pendiente' },
    { key:'checkin',  label:'checkin.json',  status:'pendiente' },
  ]);

  allDone = computed(()=> this.steps().every(s=> s.status==='ok'));

  pickUpload(){ this.view.set('wizard'); this.api.mode.set('upload'); }
  
  pickConnect(){
    
    this.api.connectToApi().subscribe(()=> this.router.navigateByUrl('/'));
  }

  onFileChange(step: Step, ev: Event){
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0]; if(!file) return;
    step.file = file; step.status = 'pendiente'; step.msg = undefined;
  }
   goDashboard(){
    // Ya estás en modo 'upload': el backend servirá los temporales.
    this.router.navigateByUrl('/');
  }
  send(step: Step){
  if(!step.file){ step.status='error'; step.msg='Seleccione un archivo'; return; }

  this.api.upload(step.key, step.file).subscribe((res: UploadResult)=>{
    if (res.ok){
      step.status = 'ok';
      step.msg = 'Cargado y validado';
    } else {
      step.status = 'error';
      step.msg = res.error || 'Error al validar';
    }
    this.steps.update(v => [...v]);
  });
}
}
