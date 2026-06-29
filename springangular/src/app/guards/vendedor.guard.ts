import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const vendedorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Debe ser Vendedor
  if (!authService.isVendedor()) {
    console.warn('Acceso denegado: Se requiere rol VENDEDOR.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
