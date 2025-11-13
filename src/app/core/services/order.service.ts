import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts'; 

interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
   headers={"token":`${localStorage.getItem('userToken')}`};

  

  createCashOrder(cartId: string, shippingAddress: ShippingAddress): Observable<any> {
    return this._httpClient.post(
      `${consts.baseUrl}/api/v1/orders/${cartId}`,
      { shippingAddress: shippingAddress },
      { headers: this.headers}
    );
  }

  
  createCheckoutSession(
    cartId: string|null, 
    shippingAddress: ShippingAddress, 
  ): Observable<any> {    
    return this._httpClient.post(
      `${consts.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${consts.serverUrl}`,
      { shippingAddress: shippingAddress },
      { headers: this.headers }
    );
  }

 
  getAllOrders(): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/orders`, );
  }

  
  getUserOrders(userId: string): Observable<any> {
      return this._httpClient.get(`${consts.baseUrl}/api/v1/orders/user/${userId}`, );
  }
}