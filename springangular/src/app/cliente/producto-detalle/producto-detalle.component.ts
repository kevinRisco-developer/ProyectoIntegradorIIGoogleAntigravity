import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RecomendacionService } from '../../services/recomendacion.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-16 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Botón Atrás -->
        <a routerLink="/" class="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-8 font-semibold">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span>Volver al Catálogo</span>
        </a>

        <!-- Loading -->
        <div *ngIf="loading" class="bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
          <span class="material-symbols-outlined text-5xl text-blue-500 animate-spin mb-4">sync</span>
          <p class="text-slate-400 font-medium">Cargando detalles del producto...</p>
        </div>

        <!-- Detalles del Producto -->
        <div *ngIf="!loading && product" class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          <!-- Imagen del Producto -->
          <div class="w-full md:w-1/2 bg-slate-950 h-[350px] md:h-[450px]">
            <img [src]="product.imagen_url" 
                 [alt]="product.nombre"
                 class="w-full h-full object-cover">
          </div>

          <!-- Información del Producto -->
          <div class="w-full md:w-1/2 p-10 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-950 text-blue-400 border border-blue-900/40 rounded-full">
                  ID: {{ product.id_producto }}
                </span>
                <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900/40 rounded-full">
                  Stock: {{ product.stock }} unidades
                </span>
              </div>

              <h1 class="text-3xl font-black tracking-tight text-white mb-4">{{ product.nombre }}</h1>
              
              <div class="text-2xl font-black text-blue-400 mb-6">\${{ product.precio | number:'1.2-2' }}</div>
              
              <p class="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                {{ product.descripcion }}
              </p>
            </div>

            <button (click)="addToCart()" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10">
              <span class="material-symbols-outlined text-sm">shopping_cart</span>
              <span>Añadir al Carrito</span>
            </button>
          </div>
        </div>

        <div *ngIf="!loading && !product" class="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
          <span class="material-symbols-outlined text-6xl text-rose-500 mb-4 font-bold">warning</span>
          <h3 class="text-xl font-bold text-slate-400">Producto no encontrado.</h3>
        </div>
      </div>
    </div>
  `
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading: boolean = true;
  startTime: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
    private recomendacionService: RecomendacionService,
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
          this.cdr.detectChanges();
          
          // Registrar interacción instantánea al entrar
          if (this.authService.isLoggedIn()) {
            this.recomendacionService.registrarInteraccion(Number(id), 'VIEW', 1).subscribe();
          }
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
    
    if (this.product && durationSeconds > 5 && this.authService.isLoggedIn()) {
      this.recomendacionService.registrarInteraccion(this.product.id_producto!, 'STAY', durationSeconds).subscribe();
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}
