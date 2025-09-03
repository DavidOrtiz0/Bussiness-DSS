import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { SupportService } from '../../services/support.service';
import { ApiService } from '../../services/api.service';
import { filter, startWith } from 'rxjs';

type Action = 'route'|'support'|'external';
export interface SidebarItem {
  icon: string;            
  label: string;          
  action: Action;
  value?: string;          
  exact?: boolean;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
   private router = inject(Router);
  private support = inject(SupportService);
  private api = inject(ApiService);

  @Input() items: SidebarItem[] = [
  { icon:'bi-cloud-upload', label:'Cargar JSON', action:'route', value:'/upload' },
  { icon:'bi-envelope', label:'Soporte',   action:'support' },
  { icon:'bi-whatsapp',     label:'WhatsApp',    action:'external', value:'https://wa.me/573007662303' },
  { icon:'bi-github', label:'Facebook', action:'external', value:'https://github.com/DavidOrtiz0/Bussiness-DSS.git'}
    ];

  mode = computed(()=> this.api.mode());

  private url$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    startWith({ url: this.router.url } as NavigationEnd)
  );

  isActive = (it: SidebarItem) => {
    if (it.action !== 'route') return false;
    const url = (this.router as any).url as string;
    return it.exact ? url === it.value : url.startsWith(it.value || '');
  };

  onClick(it: SidebarItem, ev: Event){
    ev.preventDefault();
    switch(it.action){
      case 'route':
        if (it.value) this.router.navigateByUrl(it.value);
        break;
      case 'support':
        this.support.openPanel();
        break;
      case 'external':
        if (it.value) window.open(it.value, '_blank');
        break;
    }
  }
}
