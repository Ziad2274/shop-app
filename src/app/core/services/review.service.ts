import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { IReview } from '../interfaces/iproduct';

function mapReview(r: any): IReview {
  return {
    _id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly _httpClient = inject(HttpClient);
  get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
  }

  getProductReviews(productId: string): Observable<{ data: IReview[] }> {
    return this._httpClient.get<any[]>(`${consts.baseUrl}/api/products/${productId}/reviews`).pipe(
      map(list => ({ data: (list ?? []).map(mapReview) }))
    );
  }

  addReview(productId: string, rating: number, comment: string): Observable<any> {
    return this._httpClient.post(
      `${consts.baseUrl}/api/products/${productId}/reviews`,
      { rating, comment },
      { headers: this.headers }
    );
  }

  deleteReview(productId: string, reviewId: string): Observable<any> {
    return this._httpClient.delete(`${consts.baseUrl}/api/products/${productId}/reviews/${reviewId}`, { headers: this.headers });
  }
}
