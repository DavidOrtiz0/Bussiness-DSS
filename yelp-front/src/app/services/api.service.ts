import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type Collection = 'business' | 'review' | 'user' | 'tip' | 'checkin';

type ApiOk<T> = { ok: true; data: T };
type ApiErr   = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export type UploadResult = ApiResult<{ count?: number } | any>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = '/api';
  mode = signal<'upload' | 'api'>('api');

  constructor(private http: HttpClient) {}

  // Health/smoke: comprueba que el back responde y fija modo 'api'
  connectToApi(): Observable<boolean> {
    const params = this.#withTemp(new HttpParams().set('limit', '1'));
    return this.http.get(`${this.base}/business`, { params }).pipe(
      map(() => { this.mode.set('api'); return true; }),
      catchError(() => of(false))
    );
  }

  // Upload a colecciones temporales
  upload(collection: Collection, file: File): Observable<UploadResult> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<UploadResult>(`${this.base}/upload/${collection}`, fd)
      .pipe(this.#catchApi<any>());
  }

  // ---- CRUD mínimos (por si los usas en otras vistas)
  listBusiness(query: Record<string, any>): Observable<ApiResult<any[]>> {
    const params = this.#withTemp(this.#toParams(query));
    return this.http.get<ApiResult<any[]>>(`${this.base}/business`, { params })
      .pipe(this.#catchApi<any[]>());
  }

  getBusiness(id: string): Observable<ApiResult<any>> {
    const params = this.#withTemp();
    return this.http.get<ApiResult<any>>(`${this.base}/business/${id}`, { params })
      .pipe(this.#catchApi<any>());
  }

  reviewsOfBusiness(businessId: string, limit = 50): Observable<ApiResult<any[]>> {
    const params = this.#withTemp(new HttpParams().set('limit', String(limit)));
    return this.http.get<ApiResult<any[]>>(
      `${this.base}/review/business/${businessId}`, { params }
    ).pipe(this.#catchApi<any[]>());
  }

  avgRatingOfBusiness(businessId: string): Observable<ApiResult<{ avg: number }>> {
    const params = this.#withTemp();
    return this.http.get<ApiResult<{ avg: number }>>(
      `${this.base}/review/business/${businessId}/avg`, { params }
    ).pipe(this.#catchApi<{ avg: number }>());
  }

  // ---- Endpoints de análisis (no temporales salvo que mode==='upload')
  getUbicacion(city: string, category: string) {
    const params = this.#withTemp(this.#toParams({ city, category }));
    return this.http.get<any>(`${this.base}/analysis/location`, { params });
  }

  getBrechas(city: string) {
    const params = this.#withTemp(this.#toParams({ city }));
    return this.http.get<any>(`${this.base}/analysis/gaps`, { params });
  }

  getTendencias(city: string, category: string) {
    // Si tu back expone demand por business, aquí podrías resolver un business primero.
    const params = this.#withTemp(this.#toParams({ city, category }));
    return this.http.get<any>(`${this.base}/analysis/demand`, { params });
  }

  // ---- helpers
  #withTemp(params = new HttpParams()): HttpParams {
    return this.mode() === 'upload' ? params.set('temp', 'true') : params;
  }
  #toParams(obj: Record<string, any>): HttpParams {
    return Object.entries(obj || {}).reduce(
      (p, [k, v]) => (v == null ? p : p.set(k, String(v))),
      new HttpParams()
    );
  }
  #catchApi<T>(): OperatorFunction<ApiResult<T>, ApiResult<T>> {
    return catchError((e: HttpErrorResponse) =>
      of({ ok: false, error: (e.error?.message ?? e.message ?? 'Error') } as ApiErr)
    );
  }
}
