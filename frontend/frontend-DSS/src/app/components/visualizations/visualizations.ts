import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-visualizations',
  standalone: true,
  templateUrl: './visualizations.html',
  styleUrl: './visualizations.css'
})
export class Visualizations implements OnInit{
  chart: any;

  private config: any = {
    type: 'bar',
    data: {
      labels: ['Cafetería','Pizzería','Vegano','Bar'],
      datasets: [
        { label:'Ofertas', data:[50,12,18,20], backgroundColor: 'rgba(54,162,235,.6)' },
        { label:'Demanda', data:[90,25,30,28], backgroundColor: 'rgba(255,99,132,.6)' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } }
    }
  };

  ngOnInit(): void {
    this.chart = new Chart('Mychart', this.config);
  }
}
