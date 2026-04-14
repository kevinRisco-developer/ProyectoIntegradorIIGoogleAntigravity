import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  recommendedProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Iniciando carga de recomendaciones...');
    this.productService.getRecommendations().subscribe({
      next: (prods) => {
        console.log('Recomendaciones recibidas en componente:', prods);
        this.recommendedProducts = prods;
        // Forzar a Angular a redibujar la pantalla inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching recommendations:', err);
        this.recommendedProducts = [];
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
