import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Debe ser Admin
  if (!authService.isAdmin()) {
    router.navigate(['/login']);
    return false;
  }


  // 2. Debe haber verificado MFA en esta sesión (si el usuario tiene el rol admin)
  if (!authService.isMfaVerified()) {
    console.warn('Acceso denegado: Se requiere verificación MFA para el panel de administración.');
    router.navigate(['/login']);
    return false;
  }


  return true;
};
