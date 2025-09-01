import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { AppChart } from '../chart/chart';
import { DataService } from '../../services/data.service';
import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AppChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  api = inject(ApiService);

  kpis = [
    { title: 'Negocios', value: 0 },
    { title: 'Ciudades', value: 0 },
    { title: 'Reseñas', value: 0 }
  ];

  tabs = [
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'brechas', label: 'Brechas' },
    { key: 'tendencias', label: 'Tendencias' }
  ];
  active: 'ubicacion'|'brechas'|'tendencias' = 'ubicacion';

  city = ''; category = ''; topN = 10;

  chart = { labels: [] as string[], datasets: [] as any[] };

  constructor(private ds: DataService) { this.refrescar(); }

  setTab(k: any){ this.active = k; this.refrescar(); }

  refrescar(){
    if (this.active === 'ubicacion'){
      this.ds.getUbicacion(this.city, this.category).subscribe(r=>{
        const idx = r.score.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s).slice(0,this.topN).map(x=>x.i);
        this.chart.labels = idx.map(i=> r.labels[i]);
        this.chart.datasets = [
          { label:'Score oportunidad', data: idx.map(i=> r.score[i]) }
        ];
      });
    }
    if (this.active === 'brechas'){
      this.ds.getBrechas(this.city).subscribe(r=>{
        this.chart.labels = r.labels.slice(0,this.topN);
        this.chart.datasets = [
          { label:'Oferta',  data: r.oferta.slice(0,this.topN)  },
          { label:'Demanda', data: r.demanda.slice(0,this.topN) }
        ];
      });
    }
    if (this.active === 'tendencias'){
      this.ds.getTendencias(this.city, this.category).subscribe(r=>{
        this.chart.labels = r.labels;
        this.chart.datasets = [
          { label:'Reseñas/mes', data: r.reseñas },
          { label:'Rating prom.', data: r.rating }
        ];
      });
    }
  }
}
