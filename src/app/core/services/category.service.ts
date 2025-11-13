import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { consts } from '../environments/consts';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

private readonly _httpClient=inject(HttpClient);
  getAllCategories():Observable<any>{
      return this._httpClient.get(`${consts.baseUrl}/api/v1/categories`);
    }
  getSpecificCategory(id:string):Observable<any>{
      return this._httpClient.get(`${consts.baseUrl}/api/v1/categories/${id}`);
    }  
    public getAllSubcategories(): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/subcategories`);
  }

  public getSpecificSubcategory(id: string): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/subcategories/${id}`);
  }

  public getSubcategoriesOnCategory(categoryId: string): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/categories/${categoryId}/subcategories`);
  }

}
