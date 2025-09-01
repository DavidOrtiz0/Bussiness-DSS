import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar neu-card d-none d-md-flex flex-column align-items-center py-4 gap-4">
      <i class="bi bi-cloud-upload fs-4"></i>
      <i class="bi bi-people fs-4"></i>
      <i class="bi bi-envelope fs-4"></i>
      <i class="bi bi-whatsapp fs-4"></i>
    </div>
  `,
  styles: [`
    .sidebar{
      position: fixed; left: 16px; top: 120px; width: 56px;
      border-radius: 18px; z-index: 10;
    }
    .sidebar i{cursor:pointer; opacity:.9;}
  `]
})
export class Sidebar {}
