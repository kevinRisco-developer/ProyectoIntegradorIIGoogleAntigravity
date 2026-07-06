import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Estado compartido para coordinar un único refresco simultáneo.
let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // No intentamos refrescar en los propios endpoints de autenticación
      // ni si no existe refresh token disponible.
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
      if (error.status !== 401 || isAuthEndpoint || !authService.getRefreshToken()) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        // Ya hay un refresco en curso: esperamos el nuevo token y reintentamos.
        return refreshedToken$.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap((newToken) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
          )
        );
      }

      isRefreshing = true;
      refreshedToken$.next(null);

      return authService.refreshToken().pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          const newToken = res.token;
          refreshedToken$.next(newToken);
          return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
        }),
        catchError((refreshErr) => {
          // El refresh token también expiró/es inválido → cerrar sesión.
          isRefreshing = false;
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
