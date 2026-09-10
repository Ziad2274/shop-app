import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IBrand } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly _httpClient = inject(HttpClient);

  getAllBrands(): Observable<{ data: IBrand[] }> {
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/brands`).pipe(
      map(list => ({
        data: (list ?? []).map(b => ({ _id: b.id, name: b.name, slug: b.slug, isActive: b.isActive }))
      }))
    );
  }
}
