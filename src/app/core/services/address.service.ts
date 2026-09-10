import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IAddress } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly _httpClient = inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  getMyAddresses(): Observable<{ data: IAddress[] }> {
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/address`, { headers: this.headers }).pipe(
      map(list => ({
        data: (list ?? []).map(a => ({ _id: a.id, city: a.city, street: a.street, zipCode: a.zipCode }))
      }))
    );
  }

  addAddress(address: { city: string; street: string; zipCode: string }): Observable<any> {
    return this._httpClient.post(`${consts.baseUrl}/api/address`, address, { headers: this.headers });
  }

  deleteAddress(addressId: string): Observable<any> {
    return this._httpClient.delete(`${consts.baseUrl}/api/address/${addressId}`, { headers: this.headers });
  }
}
