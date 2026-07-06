import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-categoria-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  styles: [`
    .cat-card {
      background: #0d1728;
      border: 1px solid #1e2d40;
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: border-color 0.25s;
    }
    .cat-card:hover {
      border-color: #38bdf8;
    }
    .btn-action-edit {
      flex: 1;
      padding: 0.5rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      transition: all 0.2s;
      background: #080f1a;
      border: 1px solid #1e2d40;
      color: #94a3b8;
      cursor: pointer;
    }
    .btn-action-edit:hover {
      color: #38bdf8;
      border-color: #38bdf8;
    }
    .btn-action-delete {
      flex: 1;
      padding: 0.5rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      transition: all 0.2s;
      background: #080f1a;
      border: 1px solid #1e2d40;
      color: #94a3b8;
      cursor: pointer;
    }
    .btn-action-delete:hover:not(:disabled) {
      color: #f87171;
      border-color: #991b1b;
    }
    .btn-action-delete:disabled {
      opacity: 0.4;
      cursor: not-allowed;
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
            <h1 class="text-3xl font-black" style="color:#f0f9ff">Gestión de Categorías</h1>
            <p class="text-sm mt-1" style="color:#64748b">MapStruct · Baja lógica · Auditoría de sesión</p>
          </div>
          <button (click)="openCreateForm()"
                  class="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                  style="background:linear-gradient(135deg,#0369a1,#1e40af);color:white;border:none;cursor:pointer">
            <span class="material-symbols-outlined text-sm">add</span>
            Nueva Categoría
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Total</p>
            <p class="text-2xl font-black" style="color:#38bdf8">{{ categories.length }}</p>
          </div>
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Activas</p>
            <p class="text-2xl font-black" style="color:#4ade80">{{ getActiveCount() }}</p>
          </div>
          <div class="rounded-2xl p-5" style="background:#0d1728;border:1px solid #1e2d40">
            <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:#64748b">Inactivas</p>
            <p class="text-2xl font-black" style="color:#f87171">{{ getInactiveCount() }}</p>
          </div>
        </div>

        <!-- Modal Formulario -->
        <div *ngIf="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px)">
          <div class="w-full max-w-md rounded-2xl p-8 shadow-2xl" style="background:#0d1728;border:1px solid #1e3a5f">

            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-black" style="color:#f0f9ff">{{ editingId ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
              <button (click)="closeForm()" class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#060b14;color:#64748b;border:1px solid #1e2d40;cursor:pointer">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Nombre *</label>
                <input type="text" formControlName="nombre"
                       class="w-full rounded-xl py-3 px-4 text-sm outline-none"
                       style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0"
                       placeholder="Ej: Celulares e Inteligencia">
                <p *ngIf="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched"
                   class="text-xs mt-1" style="color:#f87171">El nombre es obligatorio (mín. 2 caracteres)</p>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color:#64748b">Estado</label>
                <select formControlName="estado" class="w-full rounded-xl py-3 px-4 text-sm outline-none" style="background:#060b14;border:1.5px solid #1e2d40;color:#e2e8f0">
                  <option [value]="1">Activa</option>
                  <option [value]="0">Inactiva</option>
                </select>
              </div>

              <div class="flex justify-end gap-3 pt-4" style="border-top:1px solid #1e2d40">
                <button type="button" (click)="closeForm()"
                        class="px-5 py-2.5 rounded-xl text-sm font-semibold"
                        style="background:transparent;border:1px solid #1e2d40;color:#94a3b8;cursor:pointer">
                  Cancelar
                </button>
                <button type="submit" [disabled]="categoryForm.invalid || loadingSubmit"
                        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                        style="background:linear-gradient(135deg,#0369a1,#1e40af);color:white;border:none;cursor:pointer"
                        [style.opacity]="categoryForm.invalid ? '0.5' : '1'">
                  <span *ngIf="loadingSubmit" class="material-symbols-outlined text-sm animate-spin">sync</span>
                  {{ editingId ? 'Guardar Cambios' : 'Crear Categoría' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Grid de Categorías -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div *ngFor="let cat of categories" class="cat-card">

            <!-- Icon + Nombre -->
            <div class="flex items-start justify-between">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#0d2545;border:1px solid #1e4a7a">
                <span class="material-symbols-outlined text-lg" style="color:#38bdf8">category</span>
              </div>
              <!-- Badge estado -->
              <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                    [style.background]="cat.estado === 1 ? '#052e16' : '#1a1a1a'"
                    [style.color]="cat.estado === 1 ? '#4ade80' : '#64748b'"
                    [style.border]="cat.estado === 1 ? '1px solid #166534' : '1px solid #1e2d40'">
                {{ cat.estado === 1 ? 'Activa' : 'Inactiva' }}
              </span>
            </div>

            <div>
              <h3 class="font-bold text-base" style="color:#e2e8f0">{{ cat.nombre }}</h3>
              <p class="text-xs mt-1 font-mono" style="color:#334155">ID: {{ cat.id_categoria }}</p>
            </div>

            <!-- Acciones -->
            <div class="flex gap-2 pt-2" style="border-top:1px solid #111827">
              <button (click)="openEditForm(cat)" class="btn-action-edit">
                <span class="material-symbols-outlined text-xs">edit</span> Editar
              </button>
              <button (click)="softDelete(cat)" [disabled]="cat.estado === 0" class="btn-action-delete">
                <span class="material-symbols-outlined text-xs">block</span>
                {{ cat.estado === 0 ? 'Inactiva' : 'Dar de baja' }}
              </button>
            </div>
          </div>

          <!-- Mensaje vacío -->
          <div *ngIf="categories.length === 0" class="col-span-4 text-center py-16">
            <span class="material-symbols-outlined text-5xl mb-3 block" style="color:#1e3a5f">category</span>
            <p style="color:#475569">No hay categorías registradas aún</p>
          </div>
        </div>
      </main>
    </div>
  `
})
export class CategoriaComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  showForm = false;
  editingId: number | null = null;
  loadingSubmit = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      estado: [1]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.categoryForm.reset({ estado: 1 });
    this.showForm = true;
  }

  openEditForm(cat: Category) {
    this.editingId = cat.id_categoria || null;
    this.categoryForm.patchValue({ nombre: cat.nombre, estado: cat.estado ?? 1 });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.loadingSubmit = true;

    const payload = this.categoryForm.value;

    if (this.editingId) {
      this.productService.updateCategory(this.editingId, payload).subscribe({
        next: () => { this.loadCategories(); this.closeForm(); this.loadingSubmit = false; },
        error: () => { this.loadingSubmit = false; }
      });
    } else {
      this.productService.createCategory(payload).subscribe({
        next: () => { this.loadCategories(); this.closeForm(); this.loadingSubmit = false; },
        error: () => { this.loadingSubmit = false; }
      });
    }
  }

  softDelete(cat: Category) {
    if (!cat.id_categoria || cat.estado === 0) return;
    if (confirm(`¿Dar de baja la categoría "${cat.nombre}"? Se marcará como Inactiva (baja lógica).`)) {
      this.productService.deleteCategory(cat.id_categoria).subscribe(() => this.loadCategories());
    }
  }

  getActiveCount(): number {
    return this.categories.filter(c => c.estado === 1).length;
  }

  getInactiveCount(): number {
    return this.categories.filter(c => c.estado !== 1).length;
  }
}
