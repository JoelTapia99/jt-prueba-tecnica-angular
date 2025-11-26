import { inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../../models/Product.model';
import { ProductApi, ProductResponse } from '../../api/product.api';
import { IBadApiResponse } from '@common/models/ApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productApi = inject(ProductApi);

  readonly products = signal<IProduct[]>([]);
  readonly isLoading = signal(false);

  loadProducts(): void {
    this.productApi.getAll().subscribe((res) => {
      this.products.set(res.data || []);
    });
  }

  createProduct(product: IProduct): void {
    this.isLoading.set(true);

    this.productApi.create(product).subscribe({
      next: (res: ProductResponse) => {
        this.products.update((prevProducts) => {
          const products = prevProducts || [];
          products.push(res.data);
          return products;
        });
      },
      error: (error: IBadApiResponse) => {
        // TODO: Handle error properly
        console.warn(error);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  updateProduct(product: IProduct, id: string): void {
    this.isLoading.set(true);

    this.productApi.update(product, id).subscribe({
      next: (res: ProductResponse) => {
        this.products.update((products) =>
          products.map((prevProduct) => {
            return prevProduct.id === id ? { ...prevProduct, ...res.data } : prevProduct;
          }),
        );
      },
      error: (error: IBadApiResponse) => {
        // TODO: Handle error properly
        console.warn(error);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  deleteProduct(id: string): void {
    this.isLoading.set(true);

    this.productApi.delete(id).subscribe({
      next: () => {
        this.products.update((products) => products.filter((product) => product.id !== id));
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
