import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/product/components/product-page/product-page').then((c) => c.ProductPage),
  },
];
