import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly _httpClient=inject(HttpClient);
  headers ={"token":`${localStorage.getItem("userToken")}`};
  getUserWishList():Observable<any>{
    return this._httpClient.get(`${consts.baseUrl}/api/v1/wishlist`,{headers: this.headers})
  }
    addToWishList(id:string):Observable<any>{
    return this._httpClient.post(`${consts.baseUrl}/api/v1/wishlist`,{productId:id},{headers: this.headers})
  }
    removeFromWishList(id:string):Observable<any>{
    return this._httpClient.delete(`${consts.baseUrl}/api/v1/wishlist/${id}`,{headers: this.headers})
  }
}
