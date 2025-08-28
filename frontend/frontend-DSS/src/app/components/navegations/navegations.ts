import { Component } from '@angular/core';
import { Dashboard } from "../dashboard/dashboard";

@Component({
  selector: 'app-navegations',
  standalone: true, 
  imports: [Dashboard],
  templateUrl: './navegations.html',
  styleUrl: './navegations.css'
})
export class Navegations {

}
