import { Component, inject } from '@angular/core';
import { Img } from '@common/components/img/img';
import { ProductStore } from '../../stores/productStore/product-store';

@Component({
  selector: 'jt-product-page',
  imports: [Img],
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
}
