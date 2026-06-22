import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center bg-slate-950 font-sans p-6">
      <div class="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white text-center">
        
        <div class="mb-8">
          <div class="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-4 animate-pulse">
            <span class="material-symbols-outlined text-3xl">security</span>
          </div>
          <h2 class="text-3xl font-black tracking-tight text-white mb-2">Verificación de Seguridad</h2>
          <p class="text-slate-400 text-sm">Ingresa el código de 6 dígitos de Google Authenticator</p>
        </div>

        <form [formGroup]="mfaForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-lg text-sm font-semibold">
            {{ errorMessage }}
          </div>

          <div>
            <input type="text" formControlName="code" maxlength="6"
                   class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm text-center tracking-widest font-mono text-3xl py-3 text-white focus:outline-none" 
                   placeholder="123456" />
          </div>

          <button type="submit" [disabled]="mfaForm.invalid || loading" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/10 mt-4 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="loading">sync</span>
            <span>{{ loading ? 'Verificando...' : 'Verificar Código' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm">
          <a routerLink="/login" class="text-blue-400 font-bold hover:underline flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>Volver al Login</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class MfaComponent implements OnInit {
  mfaForm: FormGroup;
  errorMessage = '';
  loading = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
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
  }

  onSubmit() {
    if (this.mfaForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const code = this.mfaForm.get('code')?.value;
    this.authService.loginMfa({ email: this.email, code }).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.removeItem('temp_mfa_email');
        this.authService.setMfaVerified(true);
        this.cartService.syncLocalStorageToDb();
        this.router.navigate(['/']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Código incorrecto. Vuelve a intentarlo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
