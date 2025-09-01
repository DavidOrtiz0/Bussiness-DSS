import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegations } from './components/navegations/navegations';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [Navegations, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-DSS');
}
