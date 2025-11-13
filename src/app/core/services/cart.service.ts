import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { consts } from '../environments/consts';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
private readonly _httpClient=inject(HttpClient);
private cartItemsCountSubject=new BehaviorSubject<number>(0);
currentCartNumber:BehaviorSubject<number>=new BehaviorSubject<number>(0);
headers={"token":`${localStorage.getItem('userToken')}`};
// updateCartCount(newCount: number): void {
//     this.cartItemsCountSubject.next(newCount);
//   }
//  getCurrentCartCount(): number {
//       return this.cartItemsCountSubject.getValue();
//   }
//   getCartCount(): Observable<number> {
//   return this.cartItemsCountSubject.asObservable();
// }

addProductToCart(id:string): Observable<any> {
  return this._httpClient.post(
    `${consts.baseUrl}/api/v1/cart`, 
    { "productId": id }, 
    { headers: this.headers }  
  )
  // .pipe(
  //   tap((response: any) => {  
  //     if (response && response.numOfCartItems !== undefined) {
  //       this.updateCartCount(response.numOfCartItems);
  //     }
  //   })
  // );
}


UpdateCartProductQuantity (id:string,count:number): Observable<any> {
  return this._httpClient.put(
    `${consts.baseUrl}/api/v1/cart/${id}`,{"count":count},{headers:this.headers});//url,body,header(options)
}
GetCartItems(): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/cart`, { headers: this.headers })
      // .pipe(
      //   tap((response: any) => { 
      //     if (response && response.numOfCartItems !== undefined) {
      //        this.updateCartCount(response.numOfCartItems);
      //     }
      //   })
      // );//url,body,header(options)
}
RemoveCartItem(id:string): Observable<any> {
  return this._httpClient.delete(
    `${consts.baseUrl}/api/v1/cart/${id}`,{headers:this.headers});//url,body,header(options)
}
ClearCart(): Observable<any> {
  return this._httpClient.delete(
    `${consts.baseUrl}/api/v1/cart`,{headers:this.headers});//url,body,header(options)
}
}
