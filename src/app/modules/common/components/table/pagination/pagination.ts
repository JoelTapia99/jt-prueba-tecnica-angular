import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jt-pagination',
  imports: [FormsModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  options = input.required<number[]>();
  totalResults = input.required<number>();
  pageSizeInput = input<number>(5);
  onPageSize = output<number>();

  pageSize = computed(() => this.pageSizeInput());
  pageSizes = signal([5, 10, 25]);

  onChange(size: number): void {
    this.onPageSize.emit(size);
  }
}
