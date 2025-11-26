import { IProduct } from '../models/Product.model';

export const DEFAULT_PRODUCT_FORM: IProduct = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: new Date(),
  date_revision: new Date(),
};
