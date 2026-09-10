import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { consts } from '../environments/consts';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ICart } from '../interfaces/iproduct';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

function mapCart(dto: any): ICart {
  const items = dto?.items ?? [];
  return {
    status: 'success',
    numOfCartItems: items.length,
    cartId: null, // zizo-shop's cart has no separate id — it's implicit per user
    data: {
      _id: null,
      totalCartPrice: dto?.total ?? 0,
      products: items.map((i: any) => ({
        count: i.quantity,
        _id: i.productId,
        price: i.price,
        product: {
          _id: i.productId,
          id: i.productId,
          title: i.productName,
          imageCover: i.imageCover ?? PLACEHOLDER_IMG,
        },
      })),
    },
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
private readonly _httpClient=inject(HttpClient);
currentCartNumber:BehaviorSubject<number>=new BehaviorSubject<number>(0);
get headers(): HttpHeaders {
  return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
}

GetCartItems(): Observable<ICart> {
    return this._httpClient.get(`${consts.baseUrl}/api/cart`, { headers: this.headers }).pipe(
      map(mapCart)
    );
}

// zizo-shop's add/update/remove/clear endpoints just return a plain success
// string, not the updated cart, so we re-fetch the cart afterwards and
// return it in the same {numOfCartItems, ...} shape the old RouteMisr API used.
addProductToCart(id:string, quantity:number = 1): Observable<ICart> {
  return this._httpClient.post(
    `${consts.baseUrl}/api/cart`,
    { productId: id, quantity },
    { headers: this.headers }
  ).pipe(switchMap(() => this.GetCartItems()));
}

UpdateCartProductQuantity(id:string,count:number): Observable<ICart> {
  return this._httpClient.put(
    `${consts.baseUrl}/api/cart`,{ productId: id, quantity: count },{headers:this.headers}
  ).pipe(switchMap(() => this.GetCartItems()));
}

RemoveCartItem(id:string): Observable<ICart> {
  return this._httpClient.delete(
    `${consts.baseUrl}/api/cart/${id}`,{headers:this.headers}
  ).pipe(switchMap(() => this.GetCartItems()));
}

ClearCart(): Observable<any> {
  return this._httpClient.delete(`${consts.baseUrl}/api/cart`,{headers:this.headers});
}
}
