import { HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const t0 = performance.now();
  const url = req.urlWithParams;

  console.log('[HTTP] →', req.method, url, req.body ?? null, req.headers);

  return next(req).pipe(
    tap(evt => {
      // evt será HttpResponse en respuestas; evt.type existe en otros eventos
      // Solo logeamos si trae status (HttpResponse)
      const status = (evt as any)?.status;
      if (status != null) {
        const ms = (performance.now() - t0).toFixed(0);
        console.log('[HTTP] ←', req.method, url, 'status:', status, `${ms}ms`, 'body:', (evt as any).body);
      }
    }),
    catchError(err => {
      const ms = (performance.now() - t0).toFixed(0);
      console.error('[HTTP] ✖', req.method, url, `${ms}ms`, err);
      return throwError(() => err);
    })
  );
};
