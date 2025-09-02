import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-navegations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navegations.html',
  styleUrl: './navegations.css'
})
export class Navegations {
  constructor(private support: SupportService) {}
  openSupport(ev: Event){ ev.preventDefault(); this.support.openPanel(); }
}
