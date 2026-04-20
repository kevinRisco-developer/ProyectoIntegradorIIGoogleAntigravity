import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  
  view = 'login'; // 'login' o 'register'

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
      nombre: [''], // Solo para registro
      mfaCode: ['', [Validators.minLength(6), Validators.maxLength(6)]] // Para MFA
    });
  }

  toggleView() {
    this.view = this.view === 'login' ? 'register' : 'login';
    this.errorMessage = '';
    this.loginForm.reset();
  }

  showMfaMode() {
    this.view = 'mfa';
    this.errorMessage = '';
    // No reseteamos email porque lo necesitamos para el POST final de MFA
    this.loginForm.patchValue({ mfaCode: '' });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.view === 'login') {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          if (res && res.requireMfa) {
            this.showMfaMode();
          } else {
            this.authService.setMfaVerified(true); // Verificado (MFA no requerido)
            this.cartService.syncLocalStorageToDb();
            this.router.navigate(['/']);
          }
          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          this.errorMessage = 'Credenciales inválidas';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.view === 'mfa') {
      const email = this.loginForm.get('email')?.value;
      const code = this.loginForm.get('mfaCode')?.value;
      this.authService.loginMfa({ email, code }).subscribe({
        next: (res) => {
          this.authService.setMfaVerified(true);
          this.cartService.syncLocalStorageToDb();
          this.router.navigate(['/']);
          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          this.errorMessage = 'Código incorrecto. Vuelve a intentarlo.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const user = this.loginForm.value;
      this.authService.register(user).subscribe({
        next: (res) => {
          this.toggleView();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'El correo electrónico ya está registrado o Hubo un error.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
