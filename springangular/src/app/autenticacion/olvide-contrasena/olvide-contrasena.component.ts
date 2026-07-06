import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-olvide-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="relative min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50 font-sans overflow-hidden">

      <!-- Anillos decorativos (inferior izquierda) -->
      <div class="pointer-events-none absolute -left-40 bottom-0 w-[38rem] h-[38rem] rounded-full opacity-60"
           style="background: radial-gradient(circle, rgba(191,219,254,0.35) 0%, rgba(191,219,254,0) 60%);"></div>
      <div class="pointer-events-none absolute -left-24 -bottom-24 w-[26rem] h-[26rem] rounded-full border border-blue-100/70"></div>
      <div class="pointer-events-none absolute -left-10 -bottom-10 w-[18rem] h-[18rem] rounded-full border border-blue-100/60"></div>

      <!-- Barra superior de la pantalla -->
      <div class="relative z-10 flex justify-between items-center px-8 py-6">
        <span class="text-2xl font-black tracking-tighter text-blue-900">ImportSmart</span>
        <a routerLink="/" class="flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Volver al inicio
        </a>
      </div>

      <!-- Contenido central -->
      <div class="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-300/40 w-full max-w-lg p-10 sm:p-12">

          <div class="flex flex-col items-center text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-blue-900 mb-6">
              <span class="material-symbols-outlined text-3xl">lock_reset</span>
            </div>
            <h2 class="text-4xl font-black tracking-tight text-slate-900 mb-3">Recuperar acceso</h2>
            <p class="text-slate-500 text-base leading-relaxed max-w-sm">
              Ingresa el correo electrónico asociado a tu cuenta de
              <span class="font-bold text-slate-700">ImportSmart</span> para recibir las instrucciones.
            </p>
          </div>

          <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold mb-6">
            {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-sm text-center font-semibold mb-6">
            {{ successMessage }}
          </div>

          <form [formGroup]="emailForm" (ngSubmit)="onSendEmail()" class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input type="email" formControlName="email"
                       class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                       placeholder="ejemplo@empresa.com" />
              </div>
            </div>

            <button type="submit" [disabled]="emailForm.invalid || loading"
                    class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
              <span>{{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
              <span class="material-symbols-outlined text-lg" *ngIf="!loading">arrow_forward</span>
            </button>
          </form>

          <hr class="my-8 border-slate-200" />

          <p class="text-center text-sm text-slate-500">
            ¿Necesitas ayuda adicional?
            <a routerLink="/login" class="font-bold text-blue-900 hover:underline">Contactar a soporte</a>
          </p>
        </div>
      </div>

      <!-- Pie de pantalla -->
      <div class="relative z-10 text-center pb-10 pt-2">
        <div class="font-black text-blue-900 mb-1">ImportSmart</div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">The Cognitive Architect System</p>
        <div class="flex items-center justify-center gap-6 text-sm text-slate-500 mb-3">
          <a routerLink="/" class="hover:text-blue-700">Privacidad</a>
          <a routerLink="/" class="hover:text-blue-700">Términos</a>
          <a routerLink="/login" class="hover:text-blue-700">Soporte</a>
        </div>
        <p class="text-xs text-slate-400">© 2024 ImportSmart. Todos los derechos reservados.</p>
      </div>
    </div>
  `
})
export class OlvideContrasenaComponent {
  emailForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSendEmail() {
    if (this.emailForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.emailForm.get('email')?.value;
    this.authService.recuperarContrasena(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Enlace de recuperación enviado. Revisa tu correo.';
        this.emailForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'El correo ingresado no está registrado.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
