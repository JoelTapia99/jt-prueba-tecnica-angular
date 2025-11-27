import { Component, input, output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'jt-field-error',
  imports: [],
  templateUrl: './field-error.html',
  styleUrl: './field-error.css',
})
export class FieldError {
  control = input.required<AbstractControl | null>();
  onHasError = output<boolean>();

  get hasError(): boolean {
    const hasError = Boolean(
      this.control()!.invalid && (this.control()!.dirty || this.control()!.touched),
    );
    this.onHasError.emit(hasError);
    return hasError;
  }
}
