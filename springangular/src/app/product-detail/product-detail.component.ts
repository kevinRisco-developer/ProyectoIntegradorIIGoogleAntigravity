import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { HistorialService } from '../services/historial.service';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading: boolean = true;
  startTime: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
    private historialService: HistorialService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startTime = Date.now();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(Number(id)).subscribe({
        next: (p) => {
          this.product = p;
          this.loading = false;
          this.cdr.detectChanges(); // Forzar renderizado
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - this.startTime) / 1000);
    
    if (this.product && durationSeconds > 5) {
      this.historialService.createHistorial({
        id_producto: this.product.id_producto,
        id_usuario: this.getUserId(),
        permanencia: durationSeconds,
        accion: 'STAY'
      }).subscribe();
    }
  }

  private getUserId(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : 1; 
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}
