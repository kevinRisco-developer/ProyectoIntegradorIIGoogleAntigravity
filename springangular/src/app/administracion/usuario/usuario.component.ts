import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-usuario-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Gestión de Usuarios</h1>
            <p class="text-slate-400 text-sm mt-1">Administra las cuentas de usuario, sus perfiles y asignación de roles de seguridad.</p>
          </div>
          <button (click)="openCreateForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10">
            <span class="material-symbols-outlined text-sm">person_add</span>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <!-- Formulario Modal -->
        <div *ngIf="showForm" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 class="text-2xl font-bold mb-6 text-white">{{ editingId ? 'Editar Usuario' : 'Crear Usuario' }}</h2>
            
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input type="text" formControlName="nombre" 
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-655 text-sm focus:outline-none"
                       placeholder="Nombre de pila y apellido">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                <input type="email" formControlName="email" 
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-655 text-sm focus:outline-none"
                       placeholder="correo@ejemplo.com">
              </div>

              <div *ngIf="!editingId">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                <input type="password" formControlName="password" 
                       class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white placeholder-slate-655 text-sm focus:outline-none"
                       placeholder="Min. 4 caracteres">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estado</label>
                <select formControlName="estado" 
                        class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none">
                  <option [value]="1">Activo</option>
                  <option [value]="0">Inactivo</option>
                </select>
              </div>

              <div class="flex justify-end gap-4 pt-6 border-t border-slate-800 mt-6">
                <button type="button" (click)="closeForm()" 
                        class="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
                  Cancelar
                </button>
                <button type="submit" [disabled]="userForm.invalid || loadingSubmit"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loadingSubmit">sync</span>
                  <span>{{ editingId ? 'Guardar Cambios' : 'Crear Usuario' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal para Asignar Rol -->
        <div *ngIf="showRoleModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl">
            <h2 class="text-xl font-bold mb-4 text-white">Asignar Rol de Usuario</h2>
            <p class="text-xs text-slate-400 mb-6">Selecciona el nivel de acceso en el sistema para esta cuenta.</p>
            
            <div class="space-y-3">
              <button (click)="assignRole(1)" class="w-full text-left p-4 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl flex items-center gap-3 transition-all">
                <span class="material-symbols-outlined text-amber-500">shield_person</span>
                <div>
                  <span class="text-sm font-bold block text-white">Administrador (ADMIN)</span>
                  <span class="text-[10px] text-slate-500">Acceso total al sistema, backups y auditorías.</span>
                </div>
              </button>

              <button (click)="assignRole(2)" class="w-full text-left p-4 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl flex items-center gap-3 transition-all">
                <span class="material-symbols-outlined text-emerald-500">inventory</span>
                <div>
                  <span class="text-sm font-bold block text-white">Almacenero (INVENTARIO)</span>
                  <span class="text-[10px] text-slate-500">Permisos para crear y editar productos o categorías.</span>
                </div>
              </button>

              <button (click)="assignRole(3)" class="w-full text-left p-4 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl flex items-center gap-3 transition-all">
                <span class="material-symbols-outlined text-blue-500">person</span>
                <div>
                  <span class="text-sm font-bold block text-white">Cliente (CLIENTE)</span>
                  <span class="text-[10px] text-slate-500">Usuario regular para comprar y ver recomendaciones.</span>
                </div>
              </button>
            </div>

            <div class="flex justify-end pt-6 border-t border-slate-800 mt-6">
              <button (click)="showRoleModal = false" class="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs">
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Usuarios -->
        <div class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">ID</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">Correo</th>
                <th class="p-4">Roles</th>
                <th class="p-4">Estado</th>
                <th class="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let user of users" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ user.id_usuario }}</td>
                <td class="p-4 font-bold text-white uppercase tracking-tight">{{ user.nombre }}</td>
                <td class="p-4 text-slate-400">{{ user.email }}</td>
                <td class="p-4">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let r of user.roles" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/40">
                      {{ r }}
                    </span>
                  </div>
                </td>
                <td class="p-4">
                  <span [class]="user.estado === 1 ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400' : 'bg-rose-950/20 border-rose-800 text-rose-400'" 
                        class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border">
                    {{ user.estado === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button (click)="openRoleModal(user.id_usuario)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Asignar Rol">
                      <span class="material-symbols-outlined text-sm">verified_user</span>
                    </button>
                    <button (click)="openEditForm(user)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Editar">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button (click)="deleteUser(user.id_usuario)" class="p-2 hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-400" title="Eliminar">
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
export class UsuarioComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  showForm = false;
  showRoleModal = false;
  editingId: number | null = null;
  roleTargetId: number | null = null;
  loadingSubmit = false;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(4)],
      estado: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.userForm.reset({ estado: 1 });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  openEditForm(user: any) {
    this.editingId = user.id_usuario;
    this.userForm.patchValue({
      nombre: user.nombre,
      email: user.email,
      estado: user.estado,
      password: ''
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.setValidators([Validators.minLength(4)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.loadingSubmit = true;
    const userData = this.userForm.value;

    if (this.editingId) {
      this.usuarioService.updateUsuario(this.editingId, userData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert('Error al actualizar usuario: ' + (err.error || err.message));
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.usuarioService.createUsuario(userData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert('Error al crear usuario: ' + (err.error || err.message));
          this.loadingSubmit = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  openRoleModal(id: number) {
    this.roleTargetId = id;
    this.showRoleModal = true;
  }

  assignRole(idRol: number) {
    if (!this.roleTargetId) return;
    this.usuarioService.assignRole(this.roleTargetId, idRol).subscribe({
      next: () => {
        this.loadData();
        this.showRoleModal = false;
        this.roleTargetId = null;
        alert('Rol asignado correctamente');
      },
      error: (err) => {
        alert('Error al asignar rol: ' + (err.error || err.message));
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este usuario del sistema?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert('No se pudo eliminar el usuario.')
      });
    }
  }
}
