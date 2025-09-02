import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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

const arr = <T>(v: any, fb: T[] = []): T[] => Array.isArray(v) ? v as T[] : fb;
const unwrap = (d: any) => (d && typeof d === 'object' && 'ok' in d && 'data' in d) ? d.data : d;

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private api: ApiService) {}

  // ---------- KPIs ----------
  getKpis(query: Record<string, any>){
    // base rápida: usamos /business (paginado corto) y agregamos simple
    return this.api.listBusiness({ ...query, limit: 500 }).pipe(
      map(unwrap),
      map((list: any[]) => {
        const totalBusinesses = list?.length ?? 0;
        const cities = new Set<string>();
        let totalReviews = 0;
        for (const b of arr<any>(list)) {
          if (b.city) cities.add(b.city);
          totalReviews += Number(b.review_count ?? 0);
        }
        return { totalBusinesses, totalCities: cities.size, totalReviews };
      }),
      catchError(() => of({ totalBusinesses:0, totalCities:0, totalReviews:0 }))
    );
  }

  // ---------- Ubicación (con filtros) ----------
  getUbicacion(city: string, category: string) {
    return this.api.getUbicacion(city, category).pipe(
      map(unwrap),
      map((d: any): LocationRes => {
        // Si el back devuelve { total, businesses: [...] }
        const biz = Array.isArray(d?.businesses) ? d.businesses : [];
        if (biz.length) {
          const labels = biz.map((b:any)=> b.name ?? b.business_id ?? '—');
          // Score simple: estrellas * log(1+reviews)
          const score  = biz.map((b:any)=> (Number(b.stars??0) * Math.log1p(Number(b.review_count??0))) || 0);
          return { labels, score, demanda: [], oferta: [] };
        }
        // Si el back ya manda {labels, score}
        return {
          labels : arr<string>(d?.labels),
          score  : arr<number>(d?.score),
          demanda: arr<number>(d?.demanda),
          oferta : arr<number>(d?.oferta),
        };
      }),
      catchError(() => of<LocationRes>({ labels: [], score: [], demanda: [], oferta: [] }))
    );
  }

  // ---------- Ubicación (general sin filtros) ----------
  getUbicacionGeneral(topN = 10){
    // Tomamos negocios “globales” y calculamos score
    return this.api.listBusiness({ limit: 300 }).pipe(
      map(unwrap),
      map((list:any[]): LocationRes => {
        const labels = arr<any>(list).map(b=> b.name ?? b.business_id ?? '—');
        const score  = arr<any>(list).map(b=> (Number(b.stars??0) * Math.log1p(Number(b.review_count??0))) || 0);
        // ordenamos y cortamos en el componente; aquí devolvemos todo
        return { labels, score, demanda: [], oferta: [] };
      }),
      catchError(() => of<LocationRes>({ labels: [], score: [], demanda: [], oferta: [] }))
    );
  }

  // ---------- Brechas (con filtro ciudad) ----------
  getBrechas(city: string) {
    return this.api.getBrechas(city).pipe(
      map(unwrap),
      map((d: any): GapsRes => {
        // Si el back devuelve forma agregada distinta, normalizamos vacío
        if (!d?.labels && !d?.categories) {
          return { labels: [], oferta: [], demanda: [] };
        }
        return {
          labels : arr<string>(d?.labels ?? d?.categories),
          oferta : arr<number>(d?.oferta ?? d?.supply ?? []),
          demanda: arr<number>(d?.demanda ?? d?.demand ?? []),
        };
      }),
      catchError(() => of<GapsRes>({ labels: [], oferta: [], demanda: [] }))
    );
  }

  // ---------- Brechas (general sin filtros) ----------
  getBrechasGeneral(topN = 10){
    // Aproximación: a partir de /business agregamos por categoría
    return this.api.listBusiness({ limit: 500 }).pipe(
      map(unwrap),
      map((list: any[]): GapsRes => {
        const offerMap = new Map<string, number>();
        const demandMap = new Map<string, number>();
        for (const b of arr<any>(list)) {
          const cats = String(b.categories ?? '')
            .split(',')
            .map((s:string)=>s.trim())
            .filter(Boolean);
          const demandScore = (Number(b.stars??0) * Math.log1p(Number(b.review_count??0))) || 0;
          for (const c of cats){
            offerMap.set(c, (offerMap.get(c) ?? 0) + 1);
            demandMap.set(c, (demandMap.get(c) ?? 0) + demandScore);
          }
        }
        // ordenar por demanda (o por oferta si no hay)
        const labels = Array.from(offerMap.keys());
        labels.sort((a,b)=>(demandMap.get(b)??0)-(demandMap.get(a)??0));
        const selected = labels.slice(0, topN);
        const oferta  = selected.map(c=> offerMap.get(c) ?? 0);
        const demanda = selected.map(c=> +(demandMap.get(c) ?? 0).toFixed(2));
        return { labels: selected, oferta, demanda };
      }),
      catchError(() => of<GapsRes>({ labels: [], oferta: [], demanda: [] }))
    );
  }

  // ---------- Tendencias (con filtros) ----------
  getTendencias(city: string, category: string) {
    return this.api.listBusiness({ city, category, limit: 1 }).pipe(
      map(unwrap),
      switchMap((r: any) => {
        const biz = r?.[0] ?? r?.data?.[0];
        if (!biz?._id) return of<TrendsRes>({ labels: [], reseñas: [], rating: [] });

        return this.api.reviewsOfBusiness(biz._id, 500).pipe(
          map(unwrap),
          map((list: any[]) => {
            const byMonth = new Map<string, { c: number; sum: number }>();
            for (const x of arr<any>(list)) {
              const d = new Date(x.date ?? x.created_at ?? x.time ?? Date.now());
              const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
              const cur = byMonth.get(key) ?? { c: 0, sum: 0 };
              cur.c += 1; cur.sum += Number(x.stars ?? x.rating ?? 0);
              byMonth.set(key, cur);
            }
            const labels = Array.from(byMonth.keys()).sort();
            const reseñas = labels.map(k => byMonth.get(k)!.c);
            const rating  = labels.map(k => {
              const v = byMonth.get(k)!; return v.c ? +(v.sum / v.c).toFixed(2) : 0;
            });
            return { labels, reseñas, rating } as TrendsRes;
          }),
          catchError(() => of<TrendsRes>({ labels: [], reseñas: [], rating: [] }))
        );
      }),
      catchError(() => of<TrendsRes>({ labels: [], reseñas: [], rating: [] }))
    );
  }

  // ---------- Tendencias (general sin filtros) ----------
  getTendenciasGeneral(){
    // Tomamos el negocio con más reseñas de una muestra y graficamos sus reseñas por mes
    return this.api.listBusiness({ limit: 200 }).pipe(
      map(unwrap),
      switchMap((list:any[])=>{
        const top = arr<any>(list).sort((a,b)=>(b.review_count??0)-(a.review_count??0))[0];
        if (!top?._id) return of<TrendsRes>({ labels: [], reseñas: [], rating: [] });
        return this.api.reviewsOfBusiness(top._id, 500).pipe(
          map(unwrap),
          map((reviews:any[])=>{
            const byMonth = new Map<string, { c: number; sum: number }>();
            for (const x of arr<any>(reviews)) {
              const d = new Date(x.date ?? x.created_at ?? x.time ?? Date.now());
              const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
              const cur = byMonth.get(key) ?? { c: 0, sum: 0 };
              cur.c += 1; cur.sum += Number(x.stars ?? x.rating ?? 0);
              byMonth.set(key, cur);
            }
            const labels = Array.from(byMonth.keys()).sort();
            const reseñas = labels.map(k => byMonth.get(k)!.c);
            const rating  = labels.map(k => {
              const v = byMonth.get(k)!; return v.c ? +(v.sum / v.c).toFixed(2) : 0;
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
