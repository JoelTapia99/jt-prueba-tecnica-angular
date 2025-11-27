import { computed, inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../../models/Product.model';
import { ProductApi, ProductResponse } from '../../api/product-api';
import { IBadApiResponse } from '@common/models/ApiResponse.model';
import { dateToISOString } from '@common/utils/date.util';
import { finalize } from 'rxjs';
import { IPagination } from '@common/models/Pagination.model';
import { DEFAULT_PRODUCT_PAGE } from '../../constants/pagination.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productApi = inject(ProductApi);

  // =========| STATE |=========
  private readonly _rawProductData = signal<IProduct[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _pagination = signal<IPagination>(DEFAULT_PRODUCT_PAGE);

  // =========| SELECTORS |=========
  readonly products = signal<IProduct[]>([]);
  readonly productCounter = computed(() =>
    this.buildProductCounter(this._rawProductData(), this.products()),
  );
  readonly pagination = computed(() => this._pagination());
  readonly isLoading = computed(() => this._isLoading);

  // =========| ACTIONS  |=========
  loadProducts(): void {
    this._isLoading.set(true);
    this.productApi
      .getAll()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe((res) => {
        const products = res.data || [];
        this._rawProductData.set(res.data || []);
        this.products.set(products);
        this.paginate(DEFAULT_PRODUCT_PAGE.currentPage, DEFAULT_PRODUCT_PAGE.pageSize);
      });
  }

  getById(id: string): IProduct | undefined {
    return this._rawProductData().find((product) => product.id === id);
  }

  searchProducts(searchCriteria: string): void {
    const allProducts = this._rawProductData();
    if (!searchCriteria) return this.products.set(allProducts);

    const query = searchCriteria.toLowerCase();

    const productsFiltered = allProducts.filter((product) => {
      return Object.values(product).some((value) => {
        const normalized =
          value instanceof Date
            ? dateToISOString(value).toLowerCase()
            : String(value).toLowerCase();

        return normalized.includes(query);
      });
    });

    this.products.set(productsFiltered);
  }

  createProduct(product: IProduct): void {
    this._isLoading.set(true);

    this.productApi.create(product).subscribe({
      next: (res: ProductResponse) => {
        this._rawProductData.update((prevProducts) => {
          const products = prevProducts || [];
          products.push(res.data);
          return products;
        });
      },
      error: (error: IBadApiResponse) => {
        // TODO: Handle error properly
        console.warn(error);
      },
      complete: () => this._isLoading.set(false),
    });
  }

  updateProduct(product: IProduct, id: string): void {
    this._isLoading.set(true);

    this.productApi.update(product, id).subscribe({
      next: (res: ProductResponse) => {
        this._rawProductData.update((products) =>
          products.map((prevProduct) => {
            return prevProduct.id === id ? { ...prevProduct, ...res.data } : prevProduct;
          }),
        );
      },
      error: (error: IBadApiResponse) => {
        // TODO: Handle error properly
        console.warn(error);
      },
      complete: () => this._isLoading.set(false),
    });
  }

  deleteProduct(id: string): void {
    this._isLoading.set(true);

    this.productApi.delete(id).subscribe({
      next: () => {
        this._rawProductData.update((products) => products.filter((product) => product.id !== id));
      },
      complete: () => this._isLoading.set(false),
    });
  }

  paginate(page: number, pageSize: number): void {
    console.log('pageSize', pageSize);
    const allProducts = this._rawProductData();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    this.products.set(paginatedProducts);
    this._pagination.set({
      totalResults: allProducts.length,
      pageSize,
      currentPage: page,
    });
  }

  private buildProductCounter(allProducts: IProduct[], productsFiltered: IProduct[]): string {
    if (allProducts.length === 0) return 'No hay productos.';
    if (allProducts.length === 1) return '1 Producto.';
    if (allProducts.length === productsFiltered.length) return `${allProducts.length} Productos.`;
    return `${productsFiltered.length} Resultados de ${allProducts.length}.`;
  }
}
