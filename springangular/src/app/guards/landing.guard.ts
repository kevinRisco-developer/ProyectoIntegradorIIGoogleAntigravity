import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas de la tienda/landing del Cliente.
 * - Visitante anónimo → permitido (landing pública).
 * - CLIENTE → permitido.
 * - Rol interno (ADMIN/VENDEDOR/INVENTARIO) → redirige a su panel correspondiente.
 */
export const landingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isInternalRole()) {
    router.navigate([authService.homeRouteForRole()]);
    return false;
  }
  return true;
};
