import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-categoria-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Gestión de Categorías</h1>
            <p class="text-slate-400 text-sm mt-1">Crea, edita o elimina las categorías del catálogo de productos.</p>
          </div>
          <button (click)="openCreateForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Nueva Categoría</span>
          </button>
        </div>

        <!-- Formulario Modal -->
        <div *ngIf="showForm" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 class="text-2xl font-bold mb-6 text-white">{{ editingId ? 'Editar Categoría' : 'Crear Categoría' }}</h2>
            
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre de Categoría</label>
                <input type="text" formControlName="nombre" 
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-650 text-sm focus:outline-none"
                       placeholder="Ej. Celulares e Inteligencia">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
                <textarea formControlName="descripcion" rows="3"
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-650 text-sm focus:outline-none"
                       placeholder="Escribe una breve descripción para los clientes"></textarea>
              </div>

              <div class="flex justify-end gap-4 pt-6 border-t border-slate-800 mt-6">
                <button type="button" (click)="closeForm()" 
                        class="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
                  Cancelar
                </button>
                <button type="submit" [disabled]="categoryForm.invalid || loadingSubmit"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loadingSubmit">sync</span>
                  <span>{{ editingId ? 'Guardar Cambios' : 'Crear Categoría' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla de Categorías -->
        <div class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">ID</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">Descripción</th>
                <th class="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let cat of categories" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ cat.id_categoria }}</td>
                <td class="p-4 font-bold text-white uppercase tracking-tight">{{ cat.nombre }}</td>
                <td class="p-4 text-slate-400 font-light">{{ cat.descripcion || 'Sin descripción.' }}</td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button (click)="openEditForm(cat)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Editar">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button (click)="deleteCategory(cat.id_categoria)" class="p-2 hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-400" title="Eliminar">
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
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.categoryForm.reset();
    this.showForm = true;
  }

  openEditForm(category: Category) {
    this.editingId = category.id_categoria || null;
    this.categoryForm.patchValue(category);
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.loadingSubmit = true;
    const catData = this.categoryForm.value;

    if (this.editingId) {
      this.productService.updateCategory(this.editingId, catData).subscribe({
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
      this.productService.createCategory(catData).subscribe({
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

  deleteCategory(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar esta categoría? Si tiene productos asignados, podría haber un conflicto.')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert('No se pudo eliminar la categoría. Probablemente esté en uso.')
      });
    }
  }
}
