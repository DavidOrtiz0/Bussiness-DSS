import { Routes } from '@angular/router';
import { FileUpload } from './components/file-upload/file-upload';
import { App } from './app';
import { Dashboard } from './components/dashboard/dashboard';


export const routes: Routes = 
[
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'FileUpload',
        component: FileUpload
    }
];
