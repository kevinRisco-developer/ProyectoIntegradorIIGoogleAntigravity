import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans">
      <!-- Hero Section -->
      <header class="bg-slate-900/40 border-b border-slate-900 py-16 mb-8 px-6 text-center md:text-left">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 class="text-5xl font-black text-blue-400 tracking-tight">Catálogo ImportSmart</h1>
            <p class="text-slate-400 mt-4 text-lg max-w-2xl font-light">
              Explora nuestra selección de hardware de alto rendimiento, dispositivos móviles y soluciones de software profesional.
            </p>
          </div>
          
          <!-- Búsqueda Rápida -->
          <div class="relative max-w-md w-full mx-auto md:mx-0">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input type="text" 
                   [(ngModel)]="searchTerm" 
                   (input)="applyFilters()"
                   placeholder="Buscar productos..." 
                   class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 pl-12 pr-4 transition-all outline-none text-white focus:ring-1 focus:ring-blue-500">
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 pb-20">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Sidebar de Filtros -->
          <aside class="w-full lg:w-64 space-y-8">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Categorías</h3>
              <div class="flex flex-col gap-2">
                <button (click)="selectCategory(0)" 
                        [class.bg-blue-600]="selectedCategoryId === 0"
                        [class.text-white]="selectedCategoryId === 0"
                        class="text-left px-5 py-3 rounded-xl transition-all font-semibold hover:bg-slate-800 hover:text-blue-400 border border-slate-800/40 text-slate-300"
                        [class.bg-slate-900]="selectedCategoryId !== 0">
                  Todos los Productos
                </button>
                <button *ngFor="let cat of categories" 
                        (click)="selectCategory(cat.id_categoria)"
                        [class.bg-blue-600]="selectedCategoryId === cat.id_categoria"
                        [class.text-white]="selectedCategoryId === cat.id_categoria"
                        class="text-left px-5 py-3 rounded-xl transition-all font-semibold hover:bg-slate-800 hover:text-blue-400 border border-slate-800/40 text-slate-300"
                        [class.bg-slate-900]="selectedCategoryId !== cat.id_categoria">
                  {{ cat.nombre }}
                </button>
              </div>
            </div>

            <div class="pt-8 border-t border-slate-900">
              <div class="bg-blue-950/20 border border-blue-900/30 p-6 rounded-2xl">
                <h4 class="font-bold text-blue-400 text-sm uppercase mb-2">¿Eres Administrador?</h4>
                <p class="text-xs text-slate-400 leading-relaxed">
                  Inicia sesión con tu cuenta administrativa para gestionar el inventario y actualizar el stock.
                </p>
              </div>
            </div>
          </aside>

          <!-- Cuadrícula de Productos -->
          <div class="flex-1">
            <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div *ngFor="let n of [1,2,3,4,5,6]" class="bg-slate-900/60 border border-slate-800 animate-pulse h-96 rounded-3xl"></div>
            </div>

            <div *ngIf="!loading && filteredProducts.length === 0" class="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
               <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">inventory_2</span>
               <h3 class="text-xl font-bold text-slate-400">No se encontraron productos con estos criterios.</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div *ngFor="let product of filteredProducts" 
                   class="group bg-slate-900 border border-slate-850 rounded-3xl shadow-sm hover:shadow-blue-900/10 hover:border-blue-900/40 transition-all duration-500 overflow-hidden flex flex-col">
                
                <!-- Área de Imagen -->
                <div class="relative h-64 overflow-hidden bg-slate-950 cursor-pointer" [routerLink]="['/producto', product.id_producto]">
                  <img [src]="product.imagen_url" 
                       [alt]="product.nombre"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">

                  <div class="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-md">
                    <span class="text-blue-400 font-black text-lg">\${{ product.precio | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Contenido -->
                <div class="p-6 flex-1 flex flex-col">
                  <div class="flex items-center gap-2 mb-3">
                     <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-900/40 rounded-md">
                       Stock: {{ product.stock }} unidades
                     </span>
                  </div>
                  <h2 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors cursor-pointer" [routerLink]="['/producto', product.id_producto]">{{ product.nombre }}</h2>
                  <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {{ product.descripcion }}
                  </p>
                  
                  <button (click)="cartService.addToCart(product)" class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3.5 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class VistaProductosComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  searchTerm: string = '';
  selectedCategoryId: number = 0;
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategoryId = Number(params['categoria']);
      }
      this.loadData();
    });
  }


  loadData() {
    this.loading = true;
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.productService.getProducts().subscribe(prods => {
      this.products = prods;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters() {
    if (!this.products) return;
    
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = !this.searchTerm || 
                            p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            p.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = Number(this.selectedCategoryId) === 0 || 
                              Number(p.id_categoria) === Number(this.selectedCategoryId);
      
      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(id: number) {
    this.selectedCategoryId = id;
    this.applyFilters();
  }
}
