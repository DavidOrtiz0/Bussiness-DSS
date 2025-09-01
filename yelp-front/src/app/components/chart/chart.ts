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

    const ds: ChartDataset<ChartType, number[]>[] = this.datasets.map(d => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.backgroundColor ?? 'rgba(54,162,235,.6)',
      borderColor: d.borderColor
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

    // recrea para evitar problemas de tipos en updates in-place
    this.chart?.destroy();
    this.chart = new Chart(ctx, cfg);
  }
}
