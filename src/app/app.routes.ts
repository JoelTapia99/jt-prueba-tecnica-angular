import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/product/components/product-page/product-page').then((c) => c.ProductPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./modules/product/components/product-details/product-details').then(
        (c) => c.ProductDetails,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./modules/product/components/product-details/product-details').then(
        (c) => c.ProductDetails,
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./modules/common/components/error-page/error-page').then((c) => c.ErrorPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
