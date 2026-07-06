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
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 font-sans p-6">
      <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-300/40 overflow-hidden grid md:grid-cols-2">

        <!-- Panel izquierdo (navy) -->
        <div class="relative hidden md:flex flex-col justify-between bg-blue-900 p-12 text-white overflow-hidden">
          <div class="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5"></div>
          <div class="absolute -left-10 bottom-24 w-56 h-56 rounded-full bg-white/5"></div>
          <div></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-black leading-tight mb-5">El futuro del<br/>comercio global.</h1>
            <p class="text-blue-100/80 text-base leading-relaxed mb-8 max-w-xs">
              Experimenta el Arquitecto Cognitivo. Seguro, inteligente y diseñado para una gestión de cadena de suministro de alta velocidad.
            </p>
            <span class="inline-flex items-center gap-2 bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 rounded-full px-4 py-2 text-xs font-bold tracking-wide">
              <span class="material-symbols-outlined text-sm">monitoring</span>
              AI INSIGHT ACTIVATED
            </span>
          </div>
          <div class="relative z-10 flex justify-between text-[10px] font-mono uppercase tracking-widest text-blue-200/50 pt-10">
            <span>Nexus Core v2.4</span>
            <span>© 2024 ImportSmart</span>
          </div>
        </div>

        <!-- Formulario -->
        <div class="p-10 sm:p-12 flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-8">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900 text-white">
              <span class="material-symbols-outlined text-lg">hub</span>
            </span>
            <span class="font-black tracking-tight text-blue-900 text-lg">IMPORTSMART</span>
          </div>

          <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2">Accede a tu cuenta</h2>
          <p class="text-slate-500 text-sm mb-8">Bienvenido de nuevo. Ingresa tus credenciales para gestionar tus envíos inteligentes.</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold">
              {{ errorMessage }}
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-2">Correo Electrónico</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input type="email" formControlName="email"
                       class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                       placeholder="nombre@empresa.com" />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-slate-600">Contraseña</label>
                <a routerLink="/recuperar" class="text-xs font-semibold text-blue-700 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password"
                       class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-12 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                       placeholder="••••••••" />
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input type="checkbox" formControlName="remember" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Recordar esta sesión
            </label>

            <button type="submit" [disabled]="loginForm.invalid || loading"
                    class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
              <span>{{ loading ? 'Ingresando...' : 'Ingresar' }}</span>
              <span class="material-symbols-outlined text-lg" *ngIf="!loading">login</span>
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-slate-500">
            ¿Nuevo en ImportSmart?
            <a routerLink="/register" class="font-bold text-blue-900 hover:underline">Crea una cuenta</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: [false]
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
        if (res && res.mfaSetupRequired) {
          // MFA obligatorio para su rol y aún no enrolado → forzar configuración.
          localStorage.setItem('temp_mfa_email', email);
          this.authService.setSetupToken(res.token);
          this.router.navigate(['/login/mfa-setup']);
        } else if (res && res.requireMfa) {
          // Guardar el email temporalmente en localStorage para completar MFA
          localStorage.setItem('temp_mfa_email', email);
          this.router.navigate(['/login/mfa']);
        } else {
          this.authService.setMfaVerified(true);
          this.cartService.syncLocalStorageToDb();
          this.router.navigate([this.authService.homeRouteForRole()]);
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
