import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
 private readonly _httpClient=inject(HttpClient);
 getAllProducts():Observable<any>{
  return this._httpClient.get(`${consts.baseUrl}/api/v1/products`);
 }
  getSpecificProduct(id:string):Observable<any>{
  return this._httpClient.get(`${consts.baseUrl}/api/v1/products/${id}`);
 }
}
