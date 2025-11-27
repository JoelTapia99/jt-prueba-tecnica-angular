import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_PRODUCT_FORM } from '../../constants/product-details.constants';
import { trimObjectValues } from '@common/utils/object.util';
import { ProductStore } from '../../stores/productStore/product-store';
import { DatePipe } from '@angular/common';
import { DEFAULT_DATE_FORMAT } from '@common/constants/date.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { RouterLink } from '@angular/router';
import { Input } from '@common/components/table/input/input';

@Component({
  selector: 'jt-product-details',
  imports: [ReactiveFormsModule, RouterLink, Input],
  providers: [DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productStore = inject(ProductStore);
  private readonly datePipe = inject(DatePipe);

  productForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      id: [
        DEFAULT_PRODUCT_FORM.id,
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      ],
      name: [
        DEFAULT_PRODUCT_FORM.name,
        [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
      ],
      description: [
        DEFAULT_PRODUCT_FORM.description,
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      logo: [DEFAULT_PRODUCT_FORM.logo, Validators.required],
      date_release: [this.getDateFormated(DEFAULT_PRODUCT_FORM.date_release), Validators.required],
      date_revision: [
        { value: this.getDateFormated(DEFAULT_PRODUCT_FORM.date_revision), disabled: true },
        Validators.required,
      ],
    });
  }

  onSubmit(): void {
    console.log('entre', this.productForm.valid, this.productForm);
    if (this.productForm.valid) {
      const rawFormValue = this.productForm.getRawValue();
      const form = trimObjectValues(rawFormValue);
      this.productStore.createProduct(form);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.productForm.reset(DEFAULT_PRODUCT_FORM);
    const date_release = this.getDateFormated(DEFAULT_PRODUCT_FORM.date_release);
    const date_revision = this.getDateFormated(DEFAULT_PRODUCT_FORM.date_revision);
    this.productForm.patchValue({ date_release, date_revision });
  }

  private getDateFormated(date: string | Date): string {
    return this.datePipe.transform(date, DEFAULT_DATE_FORMAT) || '';
  }

  protected readonly ROUTES = ROUTES;
}
