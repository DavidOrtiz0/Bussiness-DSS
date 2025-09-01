// src/app/components/dashboard/dashboard.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { AppChart } from '../chart/chart';
import { ApiService } from '../../services/api.service';

type TabKey = 'ubicacion' | 'brechas' | 'tendencias';
type PointIdx = { s: number; i: number };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AppChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private api = inject(ApiService);

  kpis = [
    { title: 'Negocios', value: 0 },
    { title: 'Ciudades', value: 0 },
    { title: 'Reseñas', value: 0 }
  ];

  tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'brechas',   label: 'Brechas' },
    { key: 'tendencias',label: 'Tendencias' }
  ] as const;

  active: TabKey = 'brechas';

  city = 'Toronto';
  category = 'Restaurants';
  topN = 10;

  chart = { labels: [] as string[], datasets: [] as any[] };

  constructor() { this.refrescar(); }

  setTab(k: TabKey){ this.active = k; this.refrescar(); }

  refrescar(){
    if (this.active === 'ubicacion'){
      this.api.getUbicacion(this.city, this.category).subscribe((r: any)=>{
        const idx: number[] = (r.score as number[])
          .map((s: number, i: number): PointIdx => ({ s, i }))
          .sort((a: PointIdx, b: PointIdx) => b.s - a.s)
          .slice(0, this.topN)
          .map((x: PointIdx) => x.i);

        this.chart.labels = idx.map((i: number) => r.labels[i]);
        this.chart.datasets = [
          { label:'Score oportunidad', data: idx.map((i: number) => r.score[i]) }
        ];
      });
    }

    if (this.active === 'brechas'){
      this.api.getBrechas(this.city).subscribe((r: any)=>{
        const N = this.topN;
        this.chart.labels = (r.labels as string[]).slice(0, N);
        this.chart.datasets = [
          { label:'Oferta',  data: (r.oferta  as number[]).slice(0, N) },
          { label:'Demanda', data: (r.demanda as number[]).slice(0, N) }
        ];
      });
    }

    if (this.active === 'tendencias'){
      this.api.getTendencias(this.city, this.category).subscribe((r: any)=>{
        this.chart.labels = r.labels as string[];
        this.chart.datasets = [
          { label:'Reseñas/mes', data: r.reseñas as number[] },
          { label:'Rating prom.', data: r.rating as number[] }
        ];
      });
    }
  }
}
