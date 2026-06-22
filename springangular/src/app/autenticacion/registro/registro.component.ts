import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center bg-slate-950 font-sans p-6">
      <div class="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
        
        <div class="text-center mb-8">
          <div class="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4">
            <span class="material-symbols-outlined text-3xl">person_add</span>
          </div>
          <h2 class="text-3xl font-black tracking-tight text-white mb-2">Crear Cuenta</h2>
          <p class="text-slate-400 text-sm">Únete a nuestra plataforma inteligente de importaciones</p>
        </div>

        <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div *ngIf="errorMessage" class="bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-lg text-sm text-center font-semibold">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-sm text-center font-semibold">
            {{ successMessage }}
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">person</span>
              <input type="text" formControlName="nombre" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">mail</span>
              <input type="email" formControlName="email" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="correo@importsmart.com" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">lock</span>
              <input type="password" formControlName="password" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" [disabled]="registroForm.invalid || loading" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/10 mt-4 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loading">sync</span>
            <span>{{ loading ? 'Registrando...' : 'Registrarse' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta? 
          <a routerLink="/login" class="text-blue-400 font-bold hover:underline">Inicia sesión aquí</a>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.registroForm.value;
    this.authService.register(user).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'El correo electrónico ya está registrado o hay problemas técnicos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
