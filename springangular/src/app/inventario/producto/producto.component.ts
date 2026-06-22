import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-producto-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Gestión de Productos</h1>
            <p class="text-slate-400 text-sm mt-1">Crea, edita o elimina productos del inventario y gestiona sus niveles de stock.</p>
          </div>
          <button (click)="openCreateForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Nuevo Producto</span>
          </button>
        </div>

        <!-- Formulario Modal / Drawer -->
        <div *ngIf="showForm" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 class="text-2xl font-bold mb-6 text-white">{{ editingId ? 'Editar Producto' : 'Crear Producto' }}</h2>
            
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre del Producto</label>
                <input type="text" formControlName="nombre" 
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-650 text-sm focus:outline-none"
                       placeholder="Ej. iPhone 15 Pro Max">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
                <textarea formControlName="descripcion" rows="3"
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-650 text-sm focus:outline-none"
                       placeholder="Detalles y características principales del producto"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Precio ($)</label>
                  <input type="number" formControlName="precio" 
                         class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stock Disponible</label>
                  <input type="number" formControlName="stock" 
                         class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categoría</label>
                  <select formControlName="id_categoria" 
                          class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none">
                    <option *ngFor="let cat of categories" [value]="cat.id_categoria">{{ cat.nombre }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Imagen URL</label>
                  <input type="text" formControlName="imagen_url" 
                         class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-650 text-sm focus:outline-none"
                         placeholder="Enlace a la imagen del producto">
                </div>
              </div>

              <div class="flex justify-end gap-4 pt-6 border-t border-slate-800 mt-6">
                <button type="button" (click)="closeForm()" 
                        class="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
                  Cancelar
                </button>
                <button type="submit" [disabled]="productForm.invalid || loadingSubmit"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loadingSubmit">sync</span>
                  <span>{{ editingId ? 'Guardar Cambios' : 'Crear Producto' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla de Productos -->
        <div class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">ID</th>
                <th class="p-4">Imagen</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">Categoría</th>
                <th class="p-4">Precio</th>
                <th class="p-4">Stock</th>
                <th class="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let prod of products" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ prod.id_producto }}</td>
                <td class="p-4">
                  <img [src]="prod.imagen_url" [alt]="prod.nombre" class="h-10 w-10 object-cover rounded-lg border border-slate-800">
                </td>
                <td class="p-4 font-bold text-white uppercase tracking-tight">{{ prod.nombre }}</td>
                <td class="p-4 text-slate-400">{{ getCategoryName(prod.id_categoria) }}</td>
                <td class="p-4 font-mono text-blue-400 font-bold">\${{ prod.precio | number:'1.2-2' }}</td>
                <td class="p-4">
                  <span [class]="prod.stock <= 5 ? 'text-rose-400 font-bold' : 'text-slate-300'">{{ prod.stock }} u.</span>
                </td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button (click)="openEditForm(prod)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Editar">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button (click)="deleteProduct(prod.id_producto)" class="p-2 hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-400" title="Eliminar">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class ProductoComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  showForm = false;
  editingId: number | null = null;
  loadingSubmit = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      id_categoria: [1, Validators.required],
      imagen_url: ['', Validators.required],
      estado: [1]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(prods => {
      this.products = prods;
      this.cdr.detectChanges();
    });
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.productForm.reset({ id_categoria: 1, estado: 1, precio: 0, stock: 0 });
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.editingId = product.id_producto || null;
    this.productForm.patchValue(product);
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.loadingSubmit = true;
    const productData = this.productForm.value;

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, productData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar este producto del inventario?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadData());
    }
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id_categoria === id)?.nombre || 'Desconocido';
  }
}
