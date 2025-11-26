import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'jt-img',
  imports: [NgOptimizedImage],
  templateUrl: './img.html',
})
export class Img {
  path = input.required<string>();
  width = input.required<number>();
  height = input.required<number>();
  alt = input<string | undefined>(undefined);
}
