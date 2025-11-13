import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private readonly _httpClient=inject(HttpClient);
  headers ={"token":`${localStorage.getItem("userToken")}`};
  getAllAdresses():Observable<any>{
    return this._httpClient.get(`${consts.baseUrl}/api/v1/addresses`,{headers:this.headers});
  }
    getSpecificAdresses(id:string):Observable<any>{
    return this._httpClient.get(`${consts.baseUrl}/api/v1/addresses/${id}`,{headers:this.headers});
  }
  addAddress(name:string,details:string,phone:string,city:string):Observable<any>{
    return this._httpClient.post(`${consts.baseUrl}/api/v1/addresses`,{name,details,phone,city},{headers:this.headers});
  }
  removeAddress(id:string):Observable<any>{
    return this._httpClient.delete(`${consts.baseUrl}/api/v1/addresses/${id}`,{headers:this.headers});
  }
}
