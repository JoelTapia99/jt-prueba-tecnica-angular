import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductHeader } from './modules/product/components/product-header/product-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('jt-prueba-tecnica-angular');
}
