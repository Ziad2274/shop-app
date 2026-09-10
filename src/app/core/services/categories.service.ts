import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { ICategory } from '../interfaces/iproduct';

function mapCategory(c: any): ICategory {
  return {
    _id: c.id,
    name: c.name,
    slug: c.slug,
    parentCategoryId: c.parentCategoryId ?? null,
    subCategories: (c.subCategories ?? []).map(mapCategory),
  };
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _httpClient = inject(HttpClient);

  // Public endpoint — returns only top-level categories, each with nested subCategories.
  getAllCategories(): Observable<{ data: ICategory[] }> {
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/categories`).pipe(
      map(list => ({ data: (list ?? []).map(mapCategory) }))
    );
  }
}
