import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div style="height:320px"><canvas id="{{cid}}"></canvas></div>`
})
export class AppChart implements OnChanges, OnDestroy {
  @Input() type: 'bar'|'line'|'bar-horizontal' = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: {label:string; data:number[]}[] = [];
  @Input() options: any = {};
  cid = 'c'+crypto.randomUUID();
  private chart?: Chart;

  ngOnChanges() {
    if (this.chart) { this.chart.destroy(); }
    const cfg: any = {
      type: this.type === 'bar-horizontal' ? 'bar' : this.type,
      data: {
        labels: this.labels,
        datasets: this.datasets.map(d => ({ ...d, backgroundColor: 'rgba(54,162,235,.6)' }))
      },
      options: {
        indexAxis: this.type === 'bar-horizontal' ? 'y' : 'x',
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'bottom' } },
        ...this.options
      }
    };
    this.chart = new Chart(this.cid, cfg);
  }
  ngOnDestroy(){ this.chart?.destroy(); }
}
