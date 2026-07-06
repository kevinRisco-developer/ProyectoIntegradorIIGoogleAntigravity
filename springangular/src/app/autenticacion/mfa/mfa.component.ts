import { Component, ChangeDetectorRef, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

      <!-- Tarjeta -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-300/40 w-full max-w-md p-10">
        <h2 class="text-2xl font-black tracking-tight text-slate-900 mb-2">Verificación de Seguridad</h2>
        <p class="text-slate-500 text-sm mb-8">Ingresa el código de 6 dígitos de tu aplicación de autenticación para confirmar tu identidad y acceder a tu panel.</p>

        <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-sm text-center font-semibold mb-6">
          {{ errorMessage }}
        </div>

        <!-- Casillas OTP -->
        <div class="flex justify-between gap-2 mb-8">
          <input *ngFor="let d of digits; let i = index; trackBy: trackByIndex" #otpInput
                 type="text" inputmode="numeric" maxlength="1"
                 (input)="onInput($event, i)" (keydown)="onKeyDown($event, i)" (paste)="onPaste($event)"
                 class="w-12 h-14 text-center text-2xl font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-white focus:outline-none transition-all" />
        </div>

        <button type="button" (click)="onSubmit()" [disabled]="!isComplete() || loading"
                class="w-full bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-base animate-spin" *ngIf="loading">sync</span>
          <span>{{ loading ? 'Verificando...' : 'Verificar' }}</span>
          <span class="material-symbols-outlined text-lg" *ngIf="!loading">arrow_forward</span>
        </button>

        <div class="mt-4 text-center">
          <a routerLink="/login" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline">
            <span class="material-symbols-outlined text-sm">refresh</span> Reintentar inicio de sesión
          </a>
        </div>

        <div class="flex items-center gap-4 my-6">
          <span class="flex-1 h-px bg-slate-200"></span>
          <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Ayuda</span>
          <span class="flex-1 h-px bg-slate-200"></span>
        </div>

        <p class="text-center text-sm text-slate-500">¿Perdiste acceso a tu dispositivo?</p>
      </div>

      <!-- Smart Insight -->
      <div class="w-full max-w-md mt-6 bg-cyan-50 border border-cyan-100 rounded-2xl p-4 flex items-start gap-3">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-900 text-cyan-300 shrink-0">
          <span class="material-symbols-outlined text-lg">auto_awesome</span>
        </span>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Smart Insight</h4>
          <p class="text-xs text-slate-500">La autenticación multifactor añade una capa extra de seguridad estructural, reduciendo el riesgo de accesos no autorizados en un 99.9%.</p>
        </div>
      </div>

      <div class="text-center mt-8 text-xs text-slate-400">
        <p>© 2024 ImportSmart. The Cognitive Architect System.</p>
        <div class="flex items-center justify-center gap-4 mt-1">
          <a routerLink="/" class="hover:text-blue-700">Privacidad</a>
          <a routerLink="/" class="hover:text-blue-700">Términos</a>
        </div>
      </div>
    </div>
  `
})
export class MfaComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  digits: string[] = ['', '', '', '', '', ''];
  errorMessage = '';
  loading = false;
  email = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const tempEmail = localStorage.getItem('temp_mfa_email');
    if (!tempEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.email = tempEmail;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.digits[index] = value.slice(-1);
    input.value = this.digits[index];
    if (this.digits[index] && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const data = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    for (let i = 0; i < 6; i++) {
      this.digits[i] = data[i] || '';
    }
    this.otpInputs.forEach((ref, i) => (ref.nativeElement.value = this.digits[i]));
    this.focusInput(Math.min(data.length, 5));
  }

  private focusInput(index: number) {
    const arr = this.otpInputs?.toArray();
    if (arr && arr[index]) {
      arr[index].nativeElement.focus();
    }
  }

  isComplete(): boolean {
    return this.digits.every(d => d !== '');
  }

  onSubmit() {
    if (!this.isComplete()) return;

    this.loading = true;
    this.errorMessage = '';

    const code = this.digits.join('');
    this.authService.loginMfa({ email: this.email, code }).subscribe({
      next: () => {
        this.loading = false;
        localStorage.removeItem('temp_mfa_email');
        this.authService.setMfaVerified(true);
        this.cartService.syncLocalStorageToDb();
        this.router.navigate([this.authService.homeRouteForRole()]);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Código incorrecto. Vuelve a intentarlo.';
        this.loading = false;
        this.digits = ['', '', '', '', '', ''];
        this.otpInputs.forEach(ref => (ref.nativeElement.value = ''));
        this.focusInput(0);
        this.cdr.detectChanges();
      }
    });
  }
}
