import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { landingGuard } from './guards/landing.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // =====================================================
  // Rutas Públicas / Tienda del Cliente
  // (visitantes y CLIENTE; los roles internos se redirigen a su panel)
  // =====================================================
  {
    path: '',
    canActivate: [landingGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },

  // =====================================================
  // Módulo Autenticación
  // =====================================================
  {
    path: 'login',
    loadComponent: () => import('./autenticacion/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'login/mfa',
    loadComponent: () => import('./autenticacion/mfa/mfa.component').then(m => m.MfaComponent)
  },
  {
    path: 'login/mfa-setup',
    loadComponent: () => import('./autenticacion/mfa-setup/mfa-setup.component').then(m => m.MfaSetupComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./autenticacion/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./autenticacion/olvide-contrasena/olvide-contrasena.component').then(m => m.OlvideContrasenaComponent)
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./autenticacion/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // =====================================================
  // Módulo Cliente (catálogo, productos, pedidos)
  // Catálogo público solo para visitantes y CLIENTE
  // =====================================================
  {
    path: 'catalogo',
    canActivate: [landingGuard],
    loadComponent: () => import('./cliente/vista-productos/vista-productos.component').then(m => m.VistaProductosComponent)
  },
  {
    path: 'categorias',
    canActivate: [landingGuard],
    loadComponent: () => import('./cliente/vista-categorias/vista-categorias.component').then(m => m.VistaCategoriasComponent)
  },
  {
    path: 'producto/:id',
    canActivate: [landingGuard],
    loadComponent: () => import('./cliente/producto-detalle/producto-detalle.component').then(m => m.ProductoDetalleComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./cliente/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'mis-pedidos',
    canActivate: [authGuard],
    loadComponent: () => import('./cliente/mis-pedidos/mis-pedidos.component').then(m => m.MisPedidosComponent)
  },
  {
    path: 'order-confirmation/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./cliente/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'recomendaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./cliente/recomendaciones/recomendaciones.component').then(m => m.RecomendacionesComponent)
  },

  // =====================================================
  // Módulo Perfil de Usuario (cualquier usuario autenticado)
  // =====================================================
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },

  // =====================================================
  // Panel del sistema (roles internos)
  // =====================================================
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'VENDEDOR', 'INVENTARIO'] },
    loadComponent: () => import('./administracion/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
  },
  {
    path: 'admin/usuarios',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./administracion/usuario/usuario.component').then(m => m.UsuarioComponent)
  },
  {
    path: 'admin/backup',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./administracion/backup/backup.component').then(m => m.BackupComponent)
  },
  {
    path: 'admin/auditoria/usuarios',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] },
    loadComponent: () => import('./administracion/auditoria-usuario/auditoria-usuario.component').then(m => m.AuditoriaUsuarioComponent)
  },
  {
    path: 'admin/auditoria/productos',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] },
    loadComponent: () => import('./administracion/auditoria-producto/auditoria-producto.component').then(m => m.AuditoriaProductoComponent)
  },
  {
    path: 'admin/auditoria/categorias',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] },
    loadComponent: () => import('./administracion/auditoria-categoria/auditoria-categoria.component').then(m => m.AuditoriaCategoriaComponent)
  },

  // =====================================================
  // Módulo Inventario (ADMIN o INVENTARIO)
  // =====================================================
  {
    path: 'admin/productos',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] },
    loadComponent: () => import('./inventario/producto/producto.component').then(m => m.ProductoComponent)
  },
  {
    path: 'admin/categorias',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] },
    loadComponent: () => import('./inventario/categoria/categoria.component').then(m => m.CategoriaComponent)
  },

  // =====================================================
  // Módulo Ventas (VENDEDOR)
  // =====================================================
  {
    path: 'recojo-producto',
    canActivate: [roleGuard],
    data: { roles: ['VENDEDOR'] },
    loadComponent: () => import('./vendedor/recojo-producto/recojo-producto.component').then(m => m.RecojoProductoComponent)
  },

  // =====================================================
  // 404 Not Found
  // =====================================================
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
