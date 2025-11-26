import { Component, inject } from '@angular/core';
import { Img } from '@common/components/img/img';
import { ProductStore } from '../../stores/productStore/product-store';
import { Pagination } from '@common/components/table/pagination/pagination';
import { PRODUCT_PAGE_OPTIONS } from '../../constants/pagination.constants';

@Component({
  selector: 'jt-product-page',
  imports: [Img, Pagination],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  productStore = inject(ProductStore);

  constructor() {
    this.productStore.loadProducts();
  }

  filterProducts(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchCriteria = inputElement.value || '';
    this.productStore.searchProducts(searchCriteria);
  }

  protected readonly PRODUCT_PAGE_OPTIONS = PRODUCT_PAGE_OPTIONS;
}
