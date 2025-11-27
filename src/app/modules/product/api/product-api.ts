import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../models/Product.model';
import { ISuccessfulApiResponse } from '@common/models/ApiResponse.model';
import { Observable } from 'rxjs';
import { IExistId } from '../interfaces/IExistId';

export type ProductResponseList = ISuccessfulApiResponse<IProduct[]>;
export type ProductResponse = ISuccessfulApiResponse<IProduct>;
export type ProductUpdateResponse = { message: string };

@Injectable({
  providedIn: 'root',
})
export class ProductApi implements IExistId {
  private readonly apiUrl = `${environment.apiUrl}/bp/products`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ProductResponseList> {
    return this.http.get<ProductResponseList>(this.apiUrl);
  }

  create(product: IProduct): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, product);
  }

  update(product: IProduct, id: IProduct['id']): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string): Observable<ProductUpdateResponse> {
    return this.http.delete<ProductUpdateResponse>(`${this.apiUrl}/${id}`);
  }

  exists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }
}
