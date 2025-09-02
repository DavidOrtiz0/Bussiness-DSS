
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { FileUpload } from './components/file-upload/file-upload';
import { Dashboard } from './components/dashboard/dashboard';
import { SupportWidget } from './components/support-widget/support-widget';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'upload', component: FileUpload },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'upload' }
];
