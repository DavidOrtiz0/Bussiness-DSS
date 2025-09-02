import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export type Collection = 'business' | 'review' | 'user' | 'tip' | 'checkin';
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;
export type UploadResult = ApiResult<{ count?: number } | any>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = '/api';
  mode = signal<'upload' | 'api'>('api');

  constructor(private http: HttpClient) {}

  // helper de log
  #log(label: string): MonoTypeOperatorFunction<any> {
    return tap({
      next: (v) => console.log(`[API] ${label} OK:`, v),
      error: (e) => console.error(`[API] ${label} ERR:`, e)
    });
  }

  connectToApi(): Observable<boolean> {
    const params = this.#withTemp(new HttpParams().set('limit', '1'));
    return this.http.get(`${this.base}/business`, { params }).pipe(
      this.#log('GET /business?limit=1'),
      map(() => { this.mode.set('api'); return true; }),
      catchError(() => of(false))
    );
  }

  upload(collection: Collection, file: File): Observable<UploadResult> {
    const fd = new FormData(); fd.append('file', file);
    return this.http.post<UploadResult>(`${this.base}/upload/${collection}`, fd).pipe(
      this.#log(`POST /upload/${collection}`),
      this.#catchApi<any>()
    );
  }

  listBusiness(query: Record<string, any>): Observable<ApiResult<any[]>> {
    const params = this.#withTemp(this.#toParams(query));
    return this.http.get<ApiResult<any[]>>(`${this.base}/business`, { params }).pipe(
      this.#log(`GET /business ${params.toString()}`),
      this.#catchApi<any[]>()
    );
  }

  getBusiness(id: string): Observable<ApiResult<any>> {
    const params = this.#withTemp();
    return this.http.get<ApiResult<any>>(`${this.base}/business/${id}`, { params }).pipe(
      this.#log(`GET /business/${id}`),
      this.#catchApi<any>()
    );
  }

  reviewsOfBusiness(businessId: string, limit = 50): Observable<ApiResult<any[]>> {
    const params = this.#withTemp(new HttpParams().set('limit', String(limit)));
    return this.http.get<ApiResult<any[]>>(
      `${this.base}/review/business/${businessId}`, { params }
    ).pipe(
      this.#log(`GET /review/business/${businessId}?${params.toString()}`),
      this.#catchApi<any[]>()
    );
  }

  avgRatingOfBusiness(businessId: string): Observable<ApiResult<{ avg: number }>> {
    const params = this.#withTemp();
    return this.http.get<ApiResult<{ avg: number }>>(
      `${this.base}/review/business/${businessId}/avg`, { params }
    ).pipe(
      this.#log(`GET /review/business/${businessId}/avg`),
      this.#catchApi<{ avg: number }>()
    );
  }

  getUbicacion(city: string, category: string) {
    const params = this.#withTemp(this.#toParams({ city, category }));
    return this.http.get<any>(`${this.base}/analysis/location`, { params }).pipe(
      this.#log(`GET /analysis/location?${params.toString()}`)
    );
  }

  getBrechas(city: string) {
    const params = this.#withTemp(this.#toParams({ city }));
    return this.http.get<any>(`${this.base}/analysis/gaps`, { params }).pipe(
      this.#log(`GET /analysis/gaps?${params.toString()}`)
    );
  }

  getTendencias(city: string, category: string) {
    const params = this.#withTemp(this.#toParams({ city, category }));
    return this.http.get<any>(`${this.base}/analysis/demand`, { params }).pipe(
      this.#log(`GET /analysis/demand?${params.toString()}`)
    );
  }

  // helpers
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
