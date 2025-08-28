import { Component } from '@angular/core';
import { Visualizations } from '../visualizations/visualizations';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [Visualizations],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
