import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

type Collection = 'business'|'review'|'user'|'tip'|'checkin';

  export type UploadResult =
  | { ok: true;  data: any }
  | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class ApiService {



  // ajusta si usas proxy: /api → http://localhost:4000/api
  readonly base = '/api';
  // 'upload' = usando datasets temporales; 'api' = conectado a BD/API
  mode = signal<'upload'|'api'>('api');

  constructor(private http: HttpClient) {}

  connectToApi(){ this.mode.set('api'); return of(true); }

upload(collection: Collection, file: File): Observable<UploadResult> {
  const form = new FormData(); form.append('file', file);
  return this.http.post(`${this.base}/upload/${collection}`, form).pipe(
    map((r:any) => ({ ok: true, data: r } as const)),
    catchError((e:HttpErrorResponse) =>
      of({ ok: false, error: (e.error?.message ?? e.message ?? 'Error') } as const)
    )
  );
}

  
}
