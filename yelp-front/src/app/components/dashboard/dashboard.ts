import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { AppChart } from '../chart/chart';

import { DataService, LocationRes, GapsRes, TrendsRes } from '../../services/data.service';
import { HelpBubble } from "../help-bubble/help-bubble";

type TabKey = 'ubicacion' | 'brechas' | 'tendencias';
type PointIdx = { s: number; i: number };


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AppChart, HelpBubble],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

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

  active: TabKey = 'ubicacion';

  // SIN valores por defecto
  city = '';
  category = '';
  topN = 10;

  chart = { labels: [] as string[], datasets: [] as any[] };

  constructor(private ds: DataService) {
    this.refrescar();
  }

  setTab(k: TabKey){ this.active = k; this.refrescar(); }

  private setKpis(totalBiz = 0, totalCities = 0, totalReviews = 0){
    this.kpis[0].value = totalBiz;
    this.kpis[1].value = totalCities;
    this.kpis[2].value = totalReviews;
  }

  refrescar(){
    const hasFilters = !!this.city || !!this.category;

    // KPIs generales (ligeros) cada vez
    this.ds.getKpis(hasFilters ? {city:this.city, category:this.category} : {})
      .subscribe(k => this.setKpis(k.totalBusinesses, k.totalCities, k.totalReviews));

    if (this.active === 'ubicacion'){
      const src = hasFilters
        ? this.ds.getUbicacion(this.city, this.category)
        : this.ds.getUbicacionGeneral(this.topN);

      src.subscribe((r: LocationRes)=>{
        const idx: number[] = r.score
          .map((s: number, i: number): PointIdx => ({ s, i }))
          .sort((a: PointIdx, b: PointIdx) => b.s - a.s)
          .slice(0, this.topN)
          .map((x: PointIdx) => x.i);

        this.chart.labels = idx.map(i => r.labels[i] ?? '');
        this.chart.datasets = [
          { label:'Score oportunidad', data: idx.map(i => r.score[i] ?? 0) }
        ];
      });
    }

    if (this.active === 'brechas'){
      const src = hasFilters
        ? this.ds.getBrechas(this.city)
        : this.ds.getBrechasGeneral(this.topN);

      src.subscribe((r: GapsRes)=>{
        const N = this.topN;
        this.chart.labels = r.labels.slice(0, N);
        this.chart.datasets = [
          { label:'Oferta',  data: r.oferta.slice(0, N)  },
          { label:'Demanda', data: r.demanda.slice(0, N) }
        ];
      });
    }

    if (this.active === 'tendencias'){
      const src = hasFilters
        ? this.ds.getTendencias(this.city, this.category)
        : this.ds.getTendenciasGeneral();

      src.subscribe((r: TrendsRes)=>{

        this.chart.labels = r.labels;
        this.chart.datasets = [
          { label:'Reseñas/mes', data: r.reseñas },
          { label:'Rating prom.', data: r.rating }
        ];
      });
    }
  }
}
