import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  isMfaEnabled: boolean = false;
  qrUri: string = '';
  secret: string = '';
  loading: boolean = true;
  mfaForm: FormGroup;
  setupMode: boolean = false;
  mfaErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.refreshStatus();
  }

  refreshStatus() {
    this.loading = true;
    this.mfaErrorMessage = '';
    this.authService.getMfaStatus().subscribe({
      next: (res) => {
        this.isMfaEnabled = res.isMfaEnabled;
        this.loading = false;
        this.setupMode = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.mfaErrorMessage = 'Alerta de backend: ' + (err.error?.message || err.message || 'Error de conexión HTTP');
        this.cdr.detectChanges();
      }
    });
  }

  startMfaSetup() {
    this.loading = true;
    this.mfaErrorMessage = '';
    this.authService.setupMfa().subscribe({
      next: (res) => {
        this.secret = res.secret;
        this.qrUri = res.qrUri;
        this.setupMode = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.mfaErrorMessage = 'Error al configurar MFA. Inténtalo de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }

  confirmMfaSetup() {
    if (this.mfaForm.invalid) return;
    this.loading = true;
    const code = this.mfaForm.get('code')?.value;

    this.authService.enableMfa(code).subscribe({
      next: () => {
        this.isMfaEnabled = true;
        this.setupMode = false;
        this.loading = false;
      },
      error: (err) => {
        this.mfaErrorMessage = 'Código inválido. Revisa tu aplicación y vuelve a intentarlo.';
        this.loading = false;
      }
    });
  }

  disableMfa() {
    this.loading = true;
    this.authService.disableMfa().subscribe({
      next: () => {
        this.isMfaEnabled = false;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.mfaErrorMessage = 'No se pudo desactivar el MFA.';
      }
    });
  }
}
