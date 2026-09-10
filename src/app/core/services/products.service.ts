import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IProduct } from '../interfaces/iproduct';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

function mapProduct(p: any): IProduct {
  const images: string[] = p.imageUrls ?? [];
  return {
    _id: p.id,
    id: p.id,
    title: p.name,
    description: p.description,
    price: p.price,
    priceAfterDiscount: p.discountPrice ?? null,
    quantity: p.stock,
    imageCover: images[0] ?? PLACEHOLDER_IMG,
    images,
    category: p.categoryId ? { _id: p.categoryId, name: p.categoryName } : null,
    isInWishlist: !!p.isInWishlist,
    ratingsAverage: p.averageRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
  };
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating_desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface ProductPage {
  data: IProduct[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
 private readonly _httpClient=inject(HttpClient);

 // GET /api/products is paginated and filterable now: { items, totalCount,
 // pageNumber, pageSize, totalPages }. Defaults to pageSize 10 like the API.
 getAllProducts(params: ProductQueryParams = {}):Observable<ProductPage>{
  let httpParams = new HttpParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      httpParams = httpParams.set(key, String(value));
    }
  });

  return this._httpClient.get<any>(`${consts.baseUrl}/api/products`, { params: httpParams }).pipe(
    map(res => ({
      data: (res.items ?? []).map(mapProduct),
      totalCount: res.totalCount,
      pageNumber: res.pageNumber,
      pageSize: res.pageSize,
      totalPages: res.totalPages,
    }))
  );
 }

  // Real GET /api/products/{id} now exists.
  getSpecificProduct(id:string):Observable<{ data: IProduct }>{
    return this._httpClient.get<any>(`${consts.baseUrl}/api/products/${id}`).pipe(
      map(p => ({ data: mapProduct(p) }))
    );
  }
}
