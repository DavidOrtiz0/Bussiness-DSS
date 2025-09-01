import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  getUbicacion(city:string, category:string){
    const labels = ['Centro','Norte','Sur','Occidente','Oriente'];
    const demanda = [90,50,40,35,20];
    const oferta  = [30,25,20,18,15];
    const score   = demanda.map((d,i)=> +(d/Math.max(oferta[i],1)).toFixed(2));
    return of({ labels, score, demanda, oferta }).pipe(delay(200));
  }
  getBrechas(city:string){
    const labels = ['Cafetería','Pizzería','Vegano','Bar','Postres'];
    const oferta = [50,12,18,20,10];
    const demanda= [90,25,30,28,16];
    return of({ labels, oferta, demanda }).pipe(delay(200));
  }
  getTendencias(city:string, category:string){
    const labels = ['Ene','Feb','Mar','Abr','May','Jun'];
    const reseñas= [40,55,38,60,58,62];
    const rating = [4.1,4.0,4.2,4.3,4.1,4.4];
    return of({ labels, reseñas, rating }).pipe(delay(200));
  }
}
