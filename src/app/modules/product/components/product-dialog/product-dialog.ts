import { Component, Input, output, signal } from '@angular/core';

@Component({
  selector: 'jt-product-dialog',
  imports: [],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
})
export class ProductDialog {
  visible = signal(false);
  productName = signal('');
  cancel = output<void>();
  confirm = output<void>();

  @Input() set show(value: boolean) {
    this.visible.set(value);
  }

  @Input() set name(value: string | null) {
    if (value) this.productName.set(value);
  }

  close() {
    this.visible.set(false);
    this.cancel.emit();
  }

  doConfirm() {
    this.visible.set(false);
    this.confirm.emit();
  }
}
