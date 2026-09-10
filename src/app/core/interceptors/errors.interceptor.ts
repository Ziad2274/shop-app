import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// On a 401, try to silently refresh the access token once and retry the
// original request. If refresh itself fails (or there's no refresh token),
// log the user out instead of looping.
export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRoute = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh') || req.url.includes('/api/auth/register');

      if (error.status === 401 && !isAuthRoute && localStorage.getItem('refreshToken')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            authService.Logout();
            return throwError(() => refreshError);
          })
        );
      }

      console.log("Error while performing your request", error);
      return throwError(() => error);
    })
  );
};
