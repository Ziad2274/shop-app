import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { WishlistProduct } from '../interfaces/iproduct';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

function mapWishlistItem(dto: any): WishlistProduct {
  return {
    _id: dto.productId,
    id: dto.productId,
    title: dto.productName,
    price: dto.productPrice,
    imageCover: dto.coverImageUrl ?? PLACEHOLDER_IMG,
  };
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly _httpClient=inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  getUserWishList():Observable<{ data: WishlistProduct[] }>{
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/wishlist`,{headers: this.headers}).pipe(
      map(list => ({ data: (list ?? []).map(mapWishlistItem) }))
    );
  }
  // Add now takes productId in the route: POST /api/wishlist/{productId}
  addToWishList(id:string):Observable<any>{
    return this._httpClient.post(`${consts.baseUrl}/api/wishlist/${id}`,{},{headers: this.headers})
  }
  removeFromWishList(id:string):Observable<any>{
    return this._httpClient.delete(`${consts.baseUrl}/api/wishlist/${id}`,{headers: this.headers})
  }
}
