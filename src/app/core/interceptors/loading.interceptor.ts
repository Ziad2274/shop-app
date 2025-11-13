import { Spinner } from './../../../../node_modules/ngx-spinner/lib/ngx-spinner.enum.d';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let _ngxSpinnerService=inject(NgxSpinnerService);
  let spinnerName:string='climbing'; 

  _ngxSpinnerService.show(spinnerName);
  return next(req).pipe(finalize(()=>{
    _ngxSpinnerService.hide(spinnerName);
  }));
};
