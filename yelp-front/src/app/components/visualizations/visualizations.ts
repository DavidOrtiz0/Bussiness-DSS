import { Component, AfterViewInit, ViewChild, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-visualizations',
  imports: [CommonModule],               // <-- necesario para *ngIf
  standalone: true,
  templateUrl: './visualizations.html',
  styleUrl: './visualizations.css'
})
export class Visualizations implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private config: any = {
    type: 'bar',
    data: {
      labels: ['Cafetería', 'Pizzería', 'Vegano', 'Bar'],
      datasets: [
        { label: 'Ofertas',  data: [50, 12, 18, 20], backgroundColor: 'rgba(54,162,235,.6)' },
        { label: 'Demanda',  data: [90, 25, 30, 28], backgroundColor: 'rgba(255,99,132,.6)' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } }
    }
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, this.config);
  }
}
