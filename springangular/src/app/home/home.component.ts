import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product, Category } from '../models/product.model';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  recommendedProducts: Product[] = [];
  categories: Category[] = [];
  featuredProducts: any[] = [];



  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Iniciando carga de recomendaciones...');
    this.productService.getRecommendations().subscribe({
      next: (prods) => {
        this.recommendedProducts = prods;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching recommendations:', err);
        this.recommendedProducts = [];
        this.cdr.detectChanges();
      }
    });

    this.productService.getCategories().subscribe(cats => {
      this.categories = cats.slice(0, 3); // Solo tomamos las 3 primeras
      this.cdr.detectChanges();
    });

    this.productService.getFeaturedProducts().subscribe(prods => {
      this.featuredProducts = prods;
      this.cdr.detectChanges();
    });
  }



  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
