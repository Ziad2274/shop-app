import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly _httpClient = inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  // POST /api/checkout — { addressId, couponCode? } -> { orderId, message }.
  // Places the order from whatever's currently in the cart; there's no
  // separate "review cart before paying" step on the backend yet, and
  // PaymentsController is an empty stub, so this creates the order record
  // but doesn't process any actual payment.
  checkout(addressId: string, couponCode?: string): Observable<{ orderId: string; message: string }> {
    return this._httpClient.post<any>(
      `${consts.baseUrl}/api/checkout`,
      { addressId, couponCode: couponCode || null },
      { headers: this.headers }
    );
  }
}
