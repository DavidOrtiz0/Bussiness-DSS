
import {
  Component, Input, OnChanges, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, inject, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Chart, registerables, ChartConfiguration, ChartType, ChartDataset
} from 'chart.js';
Chart.register(...registerables);

type ChartKind = 'bar' | 'line' | 'bar-horizontal';

@Component({
  selector: 'app-chart',
  imports: [CommonModule],               // <-- necesario para *ngIf
  standalone: true,
  templateUrl: './chart.html'
})
export class AppChart implements AfterViewInit, OnChanges, OnDestroy {
  @Input() type: ChartKind = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: { label: string; data: number[]; backgroundColor?: any; borderColor?: any }[] = [];
  @Input() options: any = {};

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private viewReady = false;

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.isBrowser) return;
    this.buildOrUpdate();
  }

  ngOnChanges(): void {
    if (!this.isBrowser) return;
    this.buildOrUpdate();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

    private buildOrUpdate(): void {
  if (!this.viewReady || !this.canvas) return;

  const ctx = this.canvas.nativeElement.getContext('2d');
  if (!ctx) return;

  const chartType: ChartType = this.type === 'bar-horizontal' ? 'bar' : this.type;

  // paleta de colores
  const palette = [
    'rgba(250, 8, 29, 0.6)',   // verde agua
    'rgba(104, 240, 41, 0.56)',   // rojo
    
  ];

  const ds: ChartDataset<ChartType, number[]>[] = this.datasets.map((d, i) => ({
    label: d.label,
    data: d.data,
    backgroundColor: d.backgroundColor ?? palette[i % palette.length],
    borderColor: d.borderColor ?? palette[i % palette.length].replace('0.6', '1'),
    borderWidth: 1
  }));

  const cfg: ChartConfiguration<ChartType, number[], unknown> = {
    type: chartType,
    data: {
      labels: this.labels,
      datasets: ds
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: this.type === 'bar-horizontal' ? 'y' : 'x',
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } },
      ...this.options
    }
  };

  this.chart?.destroy();
  this.chart = new Chart(ctx, cfg);
}
}

