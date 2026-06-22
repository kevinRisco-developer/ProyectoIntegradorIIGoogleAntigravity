import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center bg-slate-950 font-sans p-6">
      <div class="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
        
        <div class="text-center mb-8">
          <div class="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4">
            <span class="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 class="text-3xl font-black tracking-tight text-white mb-2">Bienvenido</h2>
          <p class="text-slate-400 text-sm">Inicia sesión para acceder a la plataforma</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-lg text-sm text-center font-semibold">
            {{ errorMessage }}
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
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <a routerLink="/recuperar" class="text-xs text-blue-400 hover:underline">¿La olvidaste?</a>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">lock</span>
              <input type="password" formControlName="password" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/10 mt-4 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loading">sync</span>
            <span>{{ loading ? 'Iniciando Sesión...' : 'Ingresar' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-slate-400">
          ¿No tienes una cuenta? 
          <a routerLink="/register" class="text-blue-400 font-bold hover:underline">Regístrate aquí</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.requireMfa) {
          // Guardar el email temporalmente en localStorage para completar MFA
          localStorage.setItem('temp_mfa_email', email);
          this.router.navigate(['/login/mfa']);
        } else {
          this.authService.setMfaVerified(true);
          this.cartService.syncLocalStorageToDb();
          this.router.navigate(['/']);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas o problema de servidor';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
