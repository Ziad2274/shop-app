import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((e)=>{
      console.log("Error while performing your request",e);
      return throwError(e);
    })
  );
};
