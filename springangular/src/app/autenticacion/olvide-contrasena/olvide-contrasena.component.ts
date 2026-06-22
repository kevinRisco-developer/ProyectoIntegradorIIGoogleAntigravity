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
    <div class="min-h-[80vh] flex items-center justify-center bg-slate-950 font-sans p-6">
      <div class="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white">
        
        <div class="text-center mb-8">
          <div class="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4">
            <span class="material-symbols-outlined text-3xl">{{ step === 1 ? 'vpn_key' : 'lock_reset' }}</span>
          </div>
          <h2 class="text-3xl font-black tracking-tight text-white mb-2">Recuperar Acceso</h2>
          <p class="text-slate-400 text-sm">
            {{ step === 1 ? 'Ingresa tu correo para enviarte un enlace de recuperación' : 'Ingresa el código/token recibido y tu nueva contraseña' }}
          </p>
        </div>

        <!-- Alertas -->
        <div *ngIf="errorMessage" class="bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-lg text-sm text-center font-semibold mb-6">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-sm text-center font-semibold mb-6">
          {{ successMessage }}
        </div>

        <!-- Paso 1: Enviar correo de recuperación -->
        <form *ngIf="step === 1" [formGroup]="emailForm" (ngSubmit)="onSendEmail()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">mail</span>
              <input type="email" formControlName="email" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="correo@importsmart.com" />
            </div>
          </div>

          <button type="submit" [disabled]="emailForm.invalid || loading" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/10 mt-4 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loading">sync</span>
            <span>Enviar Token</span>
          </button>
        </form>

        <!-- Paso 2: Restablecer contraseña con Token -->
        <form *ngIf="step === 2" [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Token de Seguridad</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">key</span>
              <input type="text" formControlName="token" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none font-mono" 
                     placeholder="Token de recuperación" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nueva Contraseña</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-lg">lock</span>
              <input type="password" formControlName="password" 
                     class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none" 
                     placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" [disabled]="resetForm.invalid || loading" 
                  class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/10 mt-4 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loading">sync</span>
            <span>Restablecer Contraseña</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-slate-400 flex flex-col gap-3">
          <a *ngIf="step === 1" href="javascript:void(0)" (click)="step = 2" class="text-blue-400 font-bold hover:underline">¿Ya tienes un Token?</a>
          <a *ngIf="step === 2" href="javascript:void(0)" (click)="step = 1" class="text-blue-400 font-bold hover:underline">Volver a pedir Token</a>
          <a routerLink="/login" class="text-slate-400 hover:underline">Regresar al Login</a>
        </div>
      </div>
    </div>
  `
})
export class OlvideContrasenaComponent {
  step = 1;
  emailForm: FormGroup;
  resetForm: FormGroup;
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

    this.resetForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
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
        this.successMessage = res.message || 'Código enviado. Revisa tu buzón.';
        this.step = 2;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'El correo ingresado no está registrado.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const data = this.resetForm.value;
    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Contraseña restablecida correctamente. Redirigiendo al login...';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'Token inválido o expirado.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
