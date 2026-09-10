import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IOrder, IOrderDetail } from '../interfaces/iproduct';

function mapOrder(dto: any): IOrder {
  return {
    _id: dto.id,
    createdAt: dto.createdAt,
    totalPrice: dto.totalPrice,
    subTotal: dto.subTotal,
    shippingFee: dto.shippingFee,
    status: dto.status,
    itemCount: dto.itemCount,
  };
}

function mapOrderDetail(dto: any): IOrderDetail {
  return {
    ...mapOrder(dto),
    discountAmount: dto.discountAmount,
    couponCode: dto.couponCode ?? null,
    userEmail: dto.userEmail,
    addressId: dto.addressId,
    items: (dto.items ?? []).map((i: any) => ({
      productId: i.productId,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
      subTotal: i.subTotal,
    })),
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  // GET /api/orders/my — the signed-in user's own orders (summary list).
  getAllOrders(): Observable<IOrder[]> {
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/orders/my`, { headers: this.headers }).pipe(
      map(list => (list ?? []).map(mapOrder))
    );
  }

  // GET /api/orders/my/{id} — full detail for one of your own orders.
  getOrderDetail(orderId: string): Observable<IOrderDetail> {
    return this._httpClient.get<any>(`${consts.baseUrl}/api/orders/my/${orderId}`, { headers: this.headers }).pipe(
      map(mapOrderDetail)
    );
  }

  // PATCH /api/orders/{id}/cancel
  cancelOrder(orderId: string): Observable<any> {
    return this._httpClient.patch(`${consts.baseUrl}/api/orders/${orderId}/cancel`, {}, { headers: this.headers });
  }
}
