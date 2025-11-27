import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_PRODUCT_FORM } from '../../constants/product-details.constants';
import { trimObjectValues } from '@common/utils/object.util';
import { ProductStore } from '../../stores/productStore/product-store';
import { DatePipe } from '@angular/common';
import { DEFAULT_DATE_FORMAT } from '@common/constants/date.constants';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Input } from '@common/components/table/input/input';
import { ProductApi } from '../../api/product-api';
import { IProduct } from '../../models/Product.model';
import { Result } from '@common/utils/Result.util';
import { firstValueFrom } from 'rxjs';
import { ProductHeader } from '../product-header/product-header';

@Component({
  selector: 'jt-product-details',
  imports: [ReactiveFormsModule, RouterLink, Input, ProductHeader],
  providers: [DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productStore = inject(ProductStore);
  private readonly productApi = inject(ProductApi);
  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  productForm!: FormGroup;
  productToEdit = signal<IProduct | null>(null);
  isEditMode = signal<boolean>(false);

  ngOnInit(): void {
    this.setInitForm();
    this.buildForm();
  }

  setInitForm(): void {
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

  async onSubmit(): Promise<void> {
    console.log(this.productForm);
    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();

    await this.verifyIfIdExists(this.productForm.get('id')?.value);

    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const rawFormValue = this.productForm.getRawValue();
    const form = trimObjectValues(rawFormValue);
    this.isEditMode()
      ? this.productStore.updateProduct(form, form.id)
      : this.productStore.createProduct(form);
    await this.router.navigate(['']);
  }

  onReset(): void {
    const formValue = this.productToEdit() ? this.productToEdit()! : DEFAULT_PRODUCT_FORM;
    this.updateForm(formValue);
  }

  private getDateFormated(date: string | Date): string {
    return this.datePipe.transform(date, DEFAULT_DATE_FORMAT) || '';
  }

  private getParamId(): Result<string, null> {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(Boolean(id));
    return id ? Result.ok(id) : Result.empty();
  }

  private buildForm(): void {
    const paramIdResult = this.getParamId();
    if (paramIdResult.isEmpty()) {
      this.isEditMode.set(false);
      return;
    }

    paramIdResult.ifIsOkOrElse(
      async (id) => {
        const product = this.productStore.getById(id);
        if (product) {
          this.productToEdit.set(product);
          this.updateForm(product);
          this.productForm.get('id')?.disable();
        } else {
          await this.router.navigate(['']);
        }
      },
      () => this.productToEdit.set(null),
    );
  }

  private updateForm(product: IProduct): void {
    const date_release = this.getDateFormated(product.date_release);
    const date_revision = this.getDateFormated(product.date_revision);

    this.productForm.patchValue({
      ...product,
      date_release,
      date_revision,
    });
  }

  private async verifyIfIdExists(id: string): Promise<void> {
    const exists = await firstValueFrom(this.productApi.exists(id));

    const productIdEditing = this.productToEdit()?.id;

    if (exists && productIdEditing !== id) {
      this.productForm.get('id')?.setErrors({ duplicate: true });
    }
  }
}
