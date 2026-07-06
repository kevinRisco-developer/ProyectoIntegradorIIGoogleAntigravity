import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { RecomendacionesWidgetComponent } from '../recomendaciones/recomendaciones-widget.component';

@Component({
  selector: 'app-vista-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink, RecomendacionesWidgetComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-black text-blue-400 tracking-tight mb-4">Explorar por Categoría</h1>
          <p class="text-slate-400 max-w-xl mx-auto font-light">
            Encuentra de manera rápida el hardware o la solución informática idónea para tu negocio.
          </p>
        </div>

        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let n of [1,2,3]" class="bg-slate-900 border border-slate-800 animate-pulse h-48 rounded-2xl"></div>
        </div>

        <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let cat of categories" 
               class="bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-xl hover:border-blue-900/40 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between cursor-pointer"
               [routerLink]="['/']" [queryParams]="{categoria: cat.id_categoria}">
            <div>
              <div class="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-6">
                <span class="material-symbols-outlined text-2xl">category</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-white">{{ cat.nombre }}</h3>
              <p class="text-slate-400 text-sm font-light mb-6">
                {{ cat.descripcion || 'Sin descripción disponible para esta categoría.' }}
              </p>
            </div>
            
            <div class="text-xs text-blue-400 font-bold flex items-center gap-1">
              <span>Ver productos</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </div>
        </div>

        <!-- Modulo de recomendaciones IA (Signals + Tailwind) -->
        <div class="mt-16">
          <app-recomendaciones-widget titulo="Recomendado para ti"></app-recomendaciones-widget>
        </div>
      </div>
    </div>
  `
})
export class VistaCategoriasComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
