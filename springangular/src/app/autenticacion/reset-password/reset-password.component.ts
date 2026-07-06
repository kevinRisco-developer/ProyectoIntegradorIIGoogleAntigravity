import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 font-sans p-6">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-300/40 w-full max-w-lg p-10 sm:p-12">

        <div class="flex flex-col items-center text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-blue-900 mb-6">
            <span class="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h2 class="text-4xl font-black tracking-tight text-slate-900 mb-3">Nueva contraseña</h2>
          <p class="text-slate-500 text-base leading-relaxed max-w-sm">Ingresa tu nueva contraseña para completar la recuperación de tu cuenta de <span class="font-bold text-slate-700">ImportSmart</span>.</p>
        </div>

        <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold mb-6">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-sm text-center font-semibold mb-6">
          {{ successMessage }}
        </div>

        <div *ngIf="!token" class="text-center text-slate-500 text-sm">
          Enlace inválido: falta el token de recuperación.
          <div class="mt-4">
            <a routerLink="/recuperar" class="text-blue-700 font-bold hover:underline">Solicitar uno nuevo</a>
          </div>
        </div>

        <form *ngIf="token && !successMessage" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nueva Contraseña</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
              <input type="password" formControlName="password"
                     class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                     placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirmar Contraseña</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">shield</span>
              <input type="password" formControlName="confirm"
                     class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
                     placeholder="••••••••" />
            </div>
            <p *ngIf="resetForm.hasError('mismatch') && resetForm.get('confirm')?.touched" class="text-rose-500 text-xs mt-1">
              Las contraseñas no coinciden.
            </p>
          </div>

          <button type="submit" [disabled]="resetForm.invalid || loading"
                  class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
            <span>Restablecer contraseña</span>
          </button>
        </form>

        <hr class="my-8 border-slate-200" />

        <p class="text-center text-sm text-slate-500">
          <a routerLink="/login" class="font-bold text-blue-900 hover:underline">Regresar al login</a>
        </p>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirm: ['', [Validators.required]]
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    this.errorMessage = '';

    const data = { token: this.token, password: this.resetForm.get('password')?.value };
    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Contraseña restablecida correctamente. Redirigiendo al login...';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = typeof err.error === 'string' ? err.error : 'Token inválido o expirado.';
        this.cdr.detectChanges();
      }
    });
  }
}
