import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Navegations } from "./components/navegations/navegations";


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [Dashboard, Navegations],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-DSS');
}
