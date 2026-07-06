import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-producto-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  styles: [`
    .table-row {
      border-bottom: 1px solid #111827;
      transition: background 0.2s;
    }
    .table-row:hover {
      background: #0d1728 !important;
    }
    .btn-edit-action {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border: 1px solid #1e2d40;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }
    .btn-edit-action:hover {
      background: #0d1728;
      color: #38bdf8;
      border-color: #38bdf8;
    }
    .btn-delete-action {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border: 1px solid #1e2d40;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }
    .btn-delete-action:hover {
      background: #2d0000;
      color: #f87171;
      border-color: #991b1b;
    }
  `],
  template: `
    <div class="min-h-screen text-white font-sans flex" style="background:#060b14">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-8 overflow-auto">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:#38bdf8">Panel de Inventario</p>
            <h1 class="text-3xl font-black" style="color:#f0f9ff">Gestión de Productos</h1>
            <p class="text-sm mt-1" style="color:#64748b">CRUD completo · Auditoría automática · Baja lógica</p>
          </div>
          <button (click)="openCreateForm()"
                  class="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all"
                  style="background:linear-gradient(135deg,#0369a1,#1e40af);color:white;border:none;cursor:pointer">
            <span class="material-symbols-outlined text-sm">add</span>
            Nuevo Producto
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Total</p>
            <p class="text-2xl font-black" style="color:#38bdf8">{{ products.length }}</p>
          </div>
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Activos</p>
            <p class="text-2xl font-black" style="color:#4ade80">{{ getActiveCount() }}</p>
          </div>
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Sin Stock</p>
            <p class="text-2xl font-black" style="color:#f87171">{{ getNoStockCount() }}</p>
          </div>
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Categorías</p>
            <p class="text-2xl font-black" style="color:#818cf8">{{ categories.length }}</p>
          </div>
        </div>

        <!-- Modal Formulario -->
        <div *ngIf="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px)">
          <div class="w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl" style="background:#0d1728;border:1px solid #1e3a5f">

            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-black" style="color:#f0f9ff">{{ editingId ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
              <button (click)="closeForm()" class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#060b14;color:#64748b;border:1px solid #1e2d40;cursor:pointer">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Nombre del Producto *</label>
                  <input type="text" formControlName="nombre"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none transition-all"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                         placeholder="Ej: MacBook Pro M3 Max">
                  <p *ngIf="productForm.get('nombre')?.invalid && productForm.get('nombre')?.touched" class="text-xs mt-1" style="color:#f87171">El nombre es obligatorio</p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Descripción</label>
                  <textarea formControlName="descripcion" rows="3"
                            class="w-full rounded-xl py-3 px-4 text-sm outline-none resize-none transition-all"
                            style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                            placeholder="Detalles del producto..."></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Precio (USD) *</label>
                  <input type="number" formControlName="precio" step="0.01" min="0.01"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0">
                  <p *ngIf="productForm.get('precio')?.invalid && productForm.get('precio')?.touched" class="text-xs mt-1" style="color:#f87171">El precio debe ser mayor a 0</p>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Descuento (%)</label>
                  <input type="number" formControlName="descuento" min="0" max="100"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                         placeholder="0">
                  <p *ngIf="productForm.get('descuento')?.invalid" class="text-xs mt-1" style="color:#f87171">El descuento debe ser entre 0 y 100</p>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Stock *</label>
                  <input type="number" formControlName="stock" min="0"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0">
                  <p *ngIf="productForm.get('stock')?.invalid && productForm.get('stock')?.touched" class="text-xs mt-1" style="color:#f87171">El stock no puede ser negativo</p>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Marca</label>
                  <input type="text" formControlName="marca"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                         placeholder="Ej. Lenovo, Sony, Nike">
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Categoría *</label>
                  <select formControlName="id_categoria"
                          class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                          style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0">
                    <option *ngFor="let cat of categories" [value]="cat.id_categoria">{{ cat.nombre }}</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">URL de Imagen *</label>
                  <input type="text" formControlName="imagen_url"
                         class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                         style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                         placeholder="https://...">
                  <p *ngIf="productForm.get('imagen_url')?.invalid && productForm.get('imagen_url')?.touched" class="text-xs mt-1" style="color:#f87171">La URL de imagen es obligatoria</p>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Estado</label>
                  <select formControlName="estado" class="w-full rounded-xl py-3 px-4 text-sm outline-none" style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0">
                    <option [value]="1">Activo</option>
                    <option [value]="0">Inactivo</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4" style="border-top:1px solid #1e2d40;margin-top:1.5rem">
                <button type="button" (click)="closeForm()"
                        class="px-6 py-3 rounded-xl text-sm font-semibold"
                        style="background:transparent;border:1px solid #1e2d40;color:#94a3b8;cursor:pointer">
                  Cancelar
                </button>
                <button type="submit" [disabled]="productForm.invalid || loadingSubmit"
                        class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                        style="background:linear-gradient(135deg,#0369a1,#1e40af);color:white;border:none;cursor:pointer"
                        [style.opacity]="productForm.invalid ? '0.5' : '1'">
                  <span *ngIf="loadingSubmit" class="material-symbols-outlined text-sm animate-spin">sync</span>
                  {{ editingId ? 'Guardar Cambios' : 'Crear Producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla de Productos -->
        <div class="rounded-2xl overflow-hidden" style="background:#080f1a;border:1px solid #1e2d40">
          <!-- Search bar tabla -->
          <div class="p-5 flex items-center gap-4" style="border-bottom:1px solid #1e2d40">
            <div class="relative flex-1 max-w-xs">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color:#38bdf8">search</span>
              <input type="text" [(ngModel)]="tableSearch" placeholder="Buscar en tabla..."
                     class="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none"
                     style="background:#060b14;border:1px solid #1e2d40;color:#e2e8f0">
            </div>
            <p class="text-xs" style="color:#64748b">{{ filteredProducts.length }} productos</p>
          </div>

          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-xs font-bold uppercase tracking-wider" style="background:#060b14;color:#475569;border-bottom:1px solid #1e2d40">
                <th class="p-4">ID</th>
                <th class="p-4">Img</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">Categoría</th>
                <th class="p-4">Precio</th>
                <th class="p-4">Desc.</th>
                <th class="p-4">Stock</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y" style="divide-color:#1e2d40">
              <tr *ngFor="let prod of filteredProducts" class="table-row">
                <td class="p-4 font-mono text-xs" style="color:#38bdf8">#{{ prod.id_producto }}</td>
                <td class="p-4">
                  <img [src]="prod.imagen_url" [alt]="prod.nombre" class="h-10 w-10 object-cover rounded-lg" style="border:1px solid #1e2d40"
                       (error)="$any($event.target).src='https://placehold.co/40x40/0d1728/38bdf8?text=?'">
                </td>
                <td class="p-4 font-bold max-w-xs" style="color:#e2e8f0">
                  <div class="truncate max-w-[180px]">{{ prod.nombre }}</div>
                </td>
                <td class="p-4 text-xs" style="color:#64748b">{{ getCategoryName(prod.id_categoria) }}</td>
                <td class="p-4 font-mono font-bold" style="color:#38bdf8">\${{ prod.precio | number:'1.2-2' }}</td>
                <td class="p-4 text-center">
                  <span *ngIf="prod.descuento && prod.descuento > 0"
                        class="text-xs font-bold px-2 py-0.5 rounded"
                        style="background:#2d1919;color:#f87171;border:1px solid #991b1b">
                    {{ prod.descuento }}%
                  </span>
                  <span *ngIf="!prod.descuento || prod.descuento === 0" style="color:#334155">—</span>
                </td>
                <td class="p-4">
                  <span class="text-xs font-bold px-2 py-0.5 rounded"
                        [style.background]="prod.stock > 10 ? '#052e16' : prod.stock > 0 ? '#3f2a00' : '#2d0000'"
                        [style.color]="prod.stock > 10 ? '#4ade80' : prod.stock > 0 ? '#fbbf24' : '#f87171'"
                        [style.border]="prod.stock > 10 ? '1px solid #166534' : prod.stock > 0 ? '1px solid #92400e' : '1px solid #991b1b'">
                    {{ prod.stock }} u.
                  </span>
                </td>
                <td class="p-4">
                  <span class="text-xs font-bold px-2 py-0.5 rounded"
                        [style.background]="prod.estado === 1 ? '#052e16' : '#1a1a1a'"
                        [style.color]="prod.estado === 1 ? '#4ade80' : '#64748b'"
                        [style.border]="prod.estado === 1 ? '1px solid #166534' : '1px solid #1e2d40'">
                    {{ prod.estado === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex justify-end gap-1">
                    <button (click)="openEditForm(prod)" class="btn-edit-action" title="Editar">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button (click)="deleteProduct(prod.id_producto)" class="btn-delete-action" title="Dar de baja">
                      <span class="material-symbols-outlined text-sm">block</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="filteredProducts.length === 0" class="text-center py-12" style="border-top:1px solid #1e2d40">
            <span class="material-symbols-outlined text-4xl mb-2 block" style="color:#1e3a5f">inventory_2</span>
            <p class="text-sm" style="color:#475569">No se encontraron productos</p>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ProductoComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  showForm = false;
  editingId: number | null = null;
  loadingSubmit = false;
  tableSearch = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      marca: [''],
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
      this.applyTableSearch();
      this.cdr.detectChanges();
    });
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  applyTableSearch() {
    const q = this.tableSearch.toLowerCase();
    this.filteredProducts = q
      ? this.products.filter(p => p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q))
      : [...this.products];
  }

  openCreateForm() {
    this.editingId = null;
    this.productForm.reset({ id_categoria: 1, estado: 1, precio: 0, stock: 0, descuento: 0 });
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.editingId = product.id_producto || null;
    this.productForm.patchValue({ ...product, descuento: product.descuento ?? 0 });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.loadingSubmit = true;

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, this.productForm.value).subscribe({
        next: () => { this.loadData(); this.closeForm(); this.loadingSubmit = false; },
        error: () => { this.loadingSubmit = false; }
      });
    } else {
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => { this.loadData(); this.closeForm(); this.loadingSubmit = false; },
        error: () => { this.loadingSubmit = false; }
      });
    }
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Desea dar de baja este producto? Su estado cambiará a Inactivo (baja lógica).')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadData());
    }
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id_categoria === id)?.nombre || '—';
  }

  getActiveCount(): number {
    return this.products.filter(p => p.estado === 1).length;
  }

  getNoStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }
}
