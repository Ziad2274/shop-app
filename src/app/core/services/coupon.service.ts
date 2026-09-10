import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IApplyCouponResult } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly _httpClient = inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  // Note: this validates/previews a coupon against the current cart total —
  // the coupon is actually applied to the order when you call checkout with
  // the same code, not here.
  applyCoupon(code: string): Observable<IApplyCouponResult> {
    return this._httpClient.post<any>(`${consts.baseUrl}/api/coupons/apply`, { code }, { headers: this.headers }).pipe(
      map(res => ({ code: res.code, discountAmount: res.discountAmount, newTotal: res.newTotal }))
    );
  }
}
