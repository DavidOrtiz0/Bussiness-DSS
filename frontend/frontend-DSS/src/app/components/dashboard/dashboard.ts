import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Visualizations } from "../visualizations/visualizations";


@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, Visualizations],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  kpis = [
    { title: 'Ventas', value: 1200 },
    { title: 'Usuarios', value: 350 },
    { title: 'Pedidos', value: 75 },
    { title: 'Ingresos', value: '$4500' }
  ];

}

