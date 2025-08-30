import { Component, OnInit } from '@angular/core';

import {Chart, registerables} from 'chart.js'; 
Chart.register(...registerables);

@Component({
  selector: 'app-visualizations',
  imports: [],
  standalone: true, 
  templateUrl: './visualizations.html',
  styleUrl: './visualizations.css'
})
export class Visualizations implements OnInit{

  public config: any = {
  type: 'bar',
  data: 
  {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets:
    [
      {label: 'sales', data:['456', '245', '642'], backgroundcolor: 'blue'},
      {label: 'sales', data:['456', '245', '642'], backgroundcolor: 'red'},
      {label: 'sales', data:['456', '245', '642'], backgroundcolor: 'yellow'}
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};
chart: any;

  ngOnInit(): void {
      this.chart = new Chart('Mychart', this.config);
  }

}
