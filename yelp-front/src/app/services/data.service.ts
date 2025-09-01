import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface LocationRes {
  labels: string[];
  score: number[];
  demanda: number[];
  oferta: number[];
}

export interface GapsRes {
  labels: string[];
  oferta: number[];
  demanda: number[];
}

export interface TrendsRes {
  labels: string[];
  reseñas: number[];
  rating: number[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private api: ApiService) {}

  // Normaliza la respuesta de /analysis/location
  getUbicacion(city: string, category: string) {
    return this.api.getUbicacion(city, category).pipe(
      map((d: any): LocationRes => ({
        labels:  d?.labels  ?? d?.zones     ?? [],
        score:   d?.score   ?? d?.opportunity ?? [],
        demanda: d?.demanda ?? d?.demand    ?? [],
        oferta:  d?.oferta  ?? d?.supply    ?? [],
      }))
    );
  }

  // Normaliza la respuesta de /analysis/gaps
  getBrechas(city: string) {
    return this.api.getBrechas(city).pipe(
      map((d: any): GapsRes => ({
        labels:  d?.labels   ?? d?.categories ?? [],
        oferta:  d?.oferta   ?? d?.supply     ?? [],
        demanda: d?.demanda  ?? d?.demand     ?? [],
      }))
    );
  }

  // Construye tendencias a partir de reviews del primer negocio que coincide
  getTendencias(city: string, category: string) {
    return this.api.listBusiness({ city, category, limit: 1 }).pipe(
      switchMap(r => {
        const biz = (r as any)?.data?.[0];
        if (!biz?._id) return of<TrendsRes>({ labels: [], reseñas: [], rating: [] });

        return this.api.reviewsOfBusiness(biz._id, 500).pipe(
          map(rr => {
            const byMonth = new Map<string, { c: number; sum: number }>();
            const list: any[] = (rr as any)?.data ?? [];
            for (const x of list) {
              const d = new Date(x.date ?? x.created_at ?? x.time ?? Date.now());
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              const cur = byMonth.get(key) ?? { c: 0, sum: 0 };
              cur.c += 1;
              cur.sum += Number(x.stars ?? x.rating ?? 0);
              byMonth.set(key, cur);
            }
            const labels = Array.from(byMonth.keys()).sort();
            const reseñas = labels.map(k => byMonth.get(k)!.c);
            const rating  = labels.map(k => {
              const v = byMonth.get(k)!;
              return v.c ? +(v.sum / v.c).toFixed(2) : 0;
            });
            return { labels, reseñas, rating } as TrendsRes;
          }),
          catchError(() => of<TrendsRes>({ labels: [], reseñas: [], rating: [] }))
        );
      }),
      catchError(() => of<TrendsRes>({ labels: [], reseñas: [], rating: [] }))
    );
  }
}
