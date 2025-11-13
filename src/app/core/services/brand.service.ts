import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly _http = inject(HttpClient);


  getAllBrands(): Observable<any> {
    return this._http.get(`${consts.baseUrl}/api/v1/brands`);
  }

  
  getSpecificBrand(brandId: string): Observable<any> {
    return this._http.get(`${consts.baseUrl}/api/v1/brands/${brandId}`);
  }
}