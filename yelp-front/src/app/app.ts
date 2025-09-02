import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegations } from './components/navegations/navegations';
import { SupportWidget } from './components/support-widget/support-widget';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [Navegations, RouterOutlet, SupportWidget],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-DSS');
}
