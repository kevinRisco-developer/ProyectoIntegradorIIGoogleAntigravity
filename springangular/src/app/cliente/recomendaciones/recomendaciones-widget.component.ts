import { Component, ElementRef, Input, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecomendacionService } from '../../services/recomendacion.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

/**
 * Módulo de recomendaciones reutilizable (landing + categorías).
 * Usa Angular Signals para el estado y un carrusel/grilla en Tailwind.
 * - Usuario autenticado → recomendaciones personalizadas (/recomendacion/smart).
 * - Visitante anónimo    → popularidad (/recomendacion/public).
 */
@Component({
  selector: 'app-recomendaciones-widget',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-900/40 p-8 md:p-10 shadow-2xl">
      <!-- Encabezado -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
            <span class="material-symbols-outlined text-sm">psychology</span> IA Smart Recommendation
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight">{{ titulo }}</h2>
          <p class="text-slate-400 text-sm mt-1 font-light">
            {{ personalizado() ? 'Basado en tu comportamiento reciente.' : 'Los productos más populares seleccionados por nuestra IA.' }}
          </p>
        </div>
        <!-- Controles del carrusel -->
        <div class="flex gap-2" *ngIf="!loading() && recomendaciones().length > 0">
          <button (click)="scroll(-1)" aria-label="Anterior"
                  class="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-blue-300 hover:bg-white/10 transition-all flex items-center justify-center">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button (click)="scroll(1)" aria-label="Siguiente"
                  class="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-blue-300 hover:bg-white/10 transition-all flex items-center justify-center">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div *ngIf="loading()" class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let n of [1,2,3,4]" class="h-72 rounded-2xl bg-white/5 border border-white/10 animate-pulse"></div>
      </div>

      <!-- Vacío -->
      <div *ngIf="!loading() && recomendaciones().length === 0"
           class="text-center py-12 text-slate-500 text-sm border border-dashed border-white/10 rounded-2xl">
        Aún no hay recomendaciones disponibles. Explora el catálogo para que la IA aprenda tus gustos.
      </div>

      <!-- Carrusel / grilla -->
      <div #track *ngIf="!loading() && recomendaciones().length > 0"
           class="flex gap-6 overflow-x-auto pb-4 snap-x no-scrollbar scroll-smooth"
           style="scrollbar-width:none">

        <div *ngFor="let prod of recomendaciones()"
             class="min-w-[240px] max-w-[240px] snap-start bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all group flex flex-col">
          <div class="relative aspect-square bg-slate-950 cursor-pointer overflow-hidden" [routerLink]="['/producto', prod.id_producto]">
            <img [src]="prod.imagen_url" [alt]="prod.nombre"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 (error)="onImgErr($event)">
            <div class="absolute top-3 right-3 bg-blue-600 px-2 py-1 rounded text-[10px] font-black text-white shadow-lg">IA PICK</div>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <p *ngIf="prod.marca" class="text-[10px] uppercase tracking-wider text-blue-300/70 font-bold mb-1">{{ prod.marca }}</p>
            <h4 class="font-bold text-white text-sm mb-3 truncate cursor-pointer hover:text-blue-300"
                [routerLink]="['/producto', prod.id_producto]">{{ prod.nombre }}</h4>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
              <span class="text-lg font-black text-white">\${{ prod.precio | number:'1.2-2' }}</span>
              <button (click)="addToCart(prod)"
                      class="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-blue-900/30"
                      aria-label="Agregar al carrito">
                <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class RecomendacionesWidgetComponent implements OnInit {
  @Input() titulo = 'Selección Inteligente para ti';
  @ViewChild('track') trackRef?: ElementRef<HTMLElement>;

  recomendaciones = signal<Product[]>([]);
  loading = signal(true);
  personalizado = signal(false);

  fallbackImg = 'https://placehold.co/400x400/0d1728/38bdf8?text=Producto';

  constructor(
    private recomendacionService: RecomendacionService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const logueado = this.authService.isLoggedIn();
    this.personalizado.set(logueado);
    const fuente$ = logueado
      ? this.recomendacionService.getSmartRecommendations()
      : this.recomendacionService.getPublicRecommendations();

    fuente$.subscribe({
      next: (data) => { this.recomendaciones.set(data || []); this.loading.set(false); },
      error: () => { this.recomendaciones.set([]); this.loading.set(false); }
    });
  }

  scroll(dir: number) {
    const el = this.trackRef?.nativeElement;
    if (el) el.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }

  addToCart(prod: Product) {
    this.cartService.addToCart(prod);
  }

  onImgErr(ev: Event) { (ev.target as HTMLImageElement).src = this.fallbackImg; }
}
