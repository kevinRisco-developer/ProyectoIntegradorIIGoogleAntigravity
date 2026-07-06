import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de panel basado en roles declarados en la ruta (route.data.roles).
 * - No autenticado → /login.
 * - Rol permitido → acceso.
 * - Rol no permitido (incluido CLIENTE) → redirige a su home según rol.
 *
 * La verificación MFA no se comprueba aquí: el backend ya obliga el MFA en el
 * login para los roles que lo requieren, así que un token válido implica MFA hecho.
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowed = (route.data?.['roles'] as string[] | undefined) ?? [];
  const role = authService.getRole();

  if (role && allowed.includes(role)) {
    return true;
  }

  // Autenticado pero sin permiso para esta sección → a su propio home.
  router.navigate([authService.homeRouteForRole()]);
  return false;
};
