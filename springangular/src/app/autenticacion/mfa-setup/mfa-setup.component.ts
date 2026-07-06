import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mfa-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QRCodeComponent],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 font-sans p-6">

      <!-- Marca -->
      <div class="flex flex-col items-center mb-8">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-white mb-3">
          <span class="material-symbols-outlined text-2xl">shield</span>
        </span>
        <span class="font-black tracking-tight text-blue-900 text-xl">ImportSmart</span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mt-1">Cognitive Architect System</span>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-slate-300/40 w-full max-w-md p-10">

        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-blue-900 mb-4">
            <span class="material-symbols-outlined text-3xl">qr_code_2</span>
          </div>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mb-2">Configura tu MFA</h2>
          <p class="text-slate-500 text-sm">
            Tu rol requiere autenticación en dos pasos obligatoria. Escanea el código con Google Authenticator para continuar.
          </p>
        </div>

        <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold mb-6">
          {{ errorMessage }}
        </div>

        <div *ngIf="loading && !qrUri" class="text-center text-slate-400 py-10">
          <span class="material-symbols-outlined text-3xl animate-spin">sync</span>
          <p class="mt-2 text-sm">Generando código QR...</p>
        </div>

        <div *ngIf="qrUri" class="space-y-6">
          <!-- Paso 1: Escanear QR -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 flex justify-center">
            <qrcode [qrdata]="qrUri" [width]="200" [errorCorrectionLevel]="'M'" [margin]="1"></qrcode>
          </div>

          <div class="text-center">
            <p class="text-xs text-slate-500 mb-1">¿No puedes escanear? Ingresa esta clave manualmente:</p>
            <p class="font-mono text-sm bg-slate-100 border border-slate-200 rounded-lg py-2 px-3 text-blue-800 break-all">{{ secret }}</p>
          </div>

          <!-- Paso 2: Verificar código -->
          <form [formGroup]="mfaForm" (ngSubmit)="onConfirm()" class="space-y-4">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Código de 6 dígitos</label>
            <input type="text" formControlName="code" maxlength="6"
                   class="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white rounded-xl text-center tracking-[0.3em] font-mono text-3xl py-3 text-slate-800 focus:outline-none transition-all"
                   placeholder="123456" />

            <button type="submit" [disabled]="mfaForm.invalid || loading"
                    class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
              <span>{{ loading ? 'Activando...' : 'Activar y continuar' }}</span>
              <span class="material-symbols-outlined text-lg" *ngIf="!loading">arrow_forward</span>
            </button>
          </form>
        </div>

        <div class="mt-8 text-center text-sm">
          <a href="javascript:void(0)" (click)="cancel()" class="text-slate-500 hover:text-blue-700 hover:underline inline-flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>Cancelar y volver al login</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class MfaSetupComponent implements OnInit {
  mfaForm: FormGroup;
  qrUri = '';
  secret = '';
  errorMessage = '';
  loading = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit() {
    const tempEmail = localStorage.getItem('temp_mfa_email');
    if (!tempEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.email = tempEmail;
    this.generateQr();
  }

  generateQr() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.setupMfa().subscribe({
      next: (res) => {
        this.secret = res.secret;
        this.qrUri = res.qrUri;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo generar el código QR. Vuelve a intentarlo.';
        this.cdr.detectChanges();
      }
    });
  }

  onConfirm() {
    if (this.mfaForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const code = this.mfaForm.get('code')?.value;
    this.authService.enableMfa(code).subscribe({
      next: () => {
        // MFA activado. Limpiamos el token temporal y forzamos la verificación
        // estándar para obtener una sesión completa (access + refresh token).
        this.loading = false;
        this.authService.logout();
        localStorage.setItem('temp_mfa_email', this.email);
        this.router.navigate(['/login/mfa']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Código inválido. Revisa tu app de autenticación y reintenta.';
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.authService.logout();
    localStorage.removeItem('temp_mfa_email');
    this.router.navigate(['/login']);
  }
}
