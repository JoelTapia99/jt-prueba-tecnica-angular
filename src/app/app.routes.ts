import { Routes } from '@angular/router';
import { ROUTES } from '@common/constants/routes.constants';

export const routes: Routes = [
  {
    path: ROUTES.HOME,
    loadComponent: () =>
      import('./modules/product/components/product-page/product-page').then((c) => c.ProductPage),
  },
  {
    path: ROUTES.CREATE_PRODUCT,
    loadComponent: () =>
      import('./modules/product/components/product-details/product-details').then(
        (c) => c.ProductDetails,
      ),
  },
];
