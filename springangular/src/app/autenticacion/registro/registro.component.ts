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
    <div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 font-sans p-6">
      <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-300/40 overflow-hidden grid md:grid-cols-2">

        <!-- Panel izquierdo (features) -->
        <div class="hidden md:flex flex-col justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-12 border-r border-slate-100">
          <h1 class="text-4xl font-black tracking-tight text-blue-900 mb-4">ImportSmart</h1>
          <p class="text-slate-600 text-base leading-relaxed mb-10 max-w-xs">
            Accede a la arquitectura cognitiva de comercio exterior más avanzada del mercado.
          </p>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                <span class="material-symbols-outlined">monitoring</span>
              </span>
              <div>
                <h3 class="font-bold text-slate-800">Smart Insights</h3>
                <p class="text-sm text-slate-500">Análisis predictivo de mercados globales en tiempo real.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                <span class="material-symbols-outlined">verified_user</span>
              </span>
              <div>
                <h3 class="font-bold text-slate-800">Cumplimiento Seguro</h3>
                <p class="text-sm text-slate-500">Validación automática de normativas internacionales.</p>
              </div>
            </div>
          </div>

          <div class="mt-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
                 alt="Dashboard analítico" class="w-full h-40 object-cover" />
          </div>
        </div>

        <!-- Formulario -->
        <div class="p-10 sm:p-12 flex flex-col justify-center">
          <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2">Crear cuenta nueva</h2>
          <p class="text-slate-500 text-sm mb-8">Comienza tu viaje en la logística inteligente hoy mismo.</p>

          <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold">
              {{ errorMessage }}
            </div>
            <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-sm text-center font-semibold">
              {{ successMessage }}
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nombre Completo</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input type="text" formControlName="nombre"
                       class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                       placeholder="Ej. Juan Pérez" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Correo Electrónico</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input type="email" formControlName="email"
                       class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                       placeholder="juan@empresa.com" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Contraseña</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                  <input type="password" formControlName="password"
                         class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-10 pr-3 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                         placeholder="••••••••" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Confirmar</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">shield</span>
                  <input type="password" formControlName="confirm"
                         class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-10 pr-3 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                         placeholder="••••••••" />
                </div>
              </div>
            </div>

            <!-- Medidor de fuerza -->
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fuerza:</span>
                <div class="flex-1 grid grid-cols-4 gap-1.5">
                  <span *ngFor="let i of [0,1,2,3]" class="h-1.5 rounded-full transition-colors"
                        [ngClass]="i < strength.score ? strength.color : 'bg-slate-200'"></span>
                </div>
                <span class="text-[11px] font-bold w-16 text-right" [ngClass]="strength.textColor">{{ strength.label }}</span>
              </div>
              <p *ngIf="registroForm.hasError('mismatch') && registroForm.get('confirm')?.touched" class="text-rose-500 text-xs mt-2">
                Las contraseñas no coinciden.
              </p>
            </div>

            <label class="flex items-start gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input type="checkbox" formControlName="terms" class="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Acepto los <a href="javascript:void(0)" class="font-semibold text-blue-700 hover:underline">Términos de Servicio</a> y la <a href="javascript:void(0)" class="font-semibold text-blue-700 hover:underline">Política de Privacidad</a>.</span>
            </label>

            <button type="submit" [disabled]="registroForm.invalid || loading"
                    class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
              <span>{{ loading ? 'Registrando...' : 'Iniciar Registro Pro' }}</span>
              <span class="material-symbols-outlined text-lg" *ngIf="!loading">arrow_forward</span>
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta?
            <a routerLink="/login" class="font-bold text-blue-900 hover:underline">Inicia Sesión</a>
          </p>
        </div>
      </div>

      <!-- Sello inferior -->
      <div class="flex items-center justify-center gap-6 mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">lock</span> SSL Secure</span>
        <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">shield</span> GDPR Compliant</span>
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
    this.registroForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirm: ['', [Validators.required]],
        terms: [false, [Validators.requiredTrue]]
      },
      { validators: this.passwordsMatch }
    );
  }

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get strength() {
    const pass: string = this.registroForm.get('password')?.value || '';
    let score = 0;
    if (pass.length >= 4) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    const map = [
      { label: '-', color: 'bg-slate-200', textColor: 'text-slate-400' },
      { label: 'Débil', color: 'bg-rose-500', textColor: 'text-rose-500' },
      { label: 'Media', color: 'bg-amber-500', textColor: 'text-amber-500' },
      { label: 'Buena', color: 'bg-blue-500', textColor: 'text-blue-500' },
      { label: 'Fuerte', color: 'bg-emerald-500', textColor: 'text-emerald-500' }
    ];
    return { score, ...map[score] };
  }

  onSubmit() {
    if (this.registroForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { nombre, email, password } = this.registroForm.value;
    this.authService.register({ nombre, email, password }).subscribe({
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
