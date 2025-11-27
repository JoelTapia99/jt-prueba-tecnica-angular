import { Component, inject, signal } from '@angular/core';
import { Img } from '@common/components/img/img';
import { ProductStore } from '../../stores/productStore/product-store';
import { Pagination } from '@common/components/table/pagination/pagination';
import { PRODUCT_PAGE_OPTIONS } from '../../constants/pagination.constants';
import { Router, RouterLink } from '@angular/router';
import { ProductDialog } from '../product-dialog/product-dialog';
import { IProduct } from '../../models/Product.model';

@Component({
  selector: 'jt-product-page',
  imports: [Img, Pagination, RouterLink, ProductDialog],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  private readonly router = inject(Router);
  productStore = inject(ProductStore);

  showModal = signal<boolean>(false);
  selectedProductName = signal<string>('');
  productIdToDelete = signal<string>('');

  constructor() {
    this.productStore.loadProducts();
  }

  filterProducts(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchCriteria = inputElement.value || '';
    this.productStore.searchProducts(searchCriteria);
  }

  async goToProduct(id: string) {
    await this.router.navigate(['edit', id]);
  }

  deleteProduct(id: string) {
    this.productStore.deleteProduct(id);
  }

  openDeleteModal(product: IProduct) {
    console.log({ product });
    this.selectedProductName.set(product.name);
    this.showModal.set(true);
    this.productIdToDelete.set(product.id);
  }

  onCancel() {
    this.showModal.set(false);
  }

  onConfirm() {
    this.deleteProduct(this.productIdToDelete());
    this.showModal.set(false);
  }

  protected readonly PRODUCT_PAGE_OPTIONS = PRODUCT_PAGE_OPTIONS;
}
