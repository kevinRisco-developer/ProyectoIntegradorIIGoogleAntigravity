import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { vendedorGuard } from './guards/vendedor.guard';

export const routes: Routes = [
  // =====================================================
  // Rutas Públicas
  // =====================================================
  {
    path: '',
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
    path: 'register',
    loadComponent: () => import('./autenticacion/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./autenticacion/olvide-contrasena/olvide-contrasena.component').then(m => m.OlvideContrasenaComponent)
  },

  // =====================================================
  // Módulo Cliente (catálogo, productos, pedidos)
  // =====================================================
  {
    path: 'catalogo',
    loadComponent: () => import('./cliente/vista-productos/vista-productos.component').then(m => m.VistaProductosComponent)
  },
  {
    path: 'categorias',
    loadComponent: () => import('./cliente/vista-categorias/vista-categorias.component').then(m => m.VistaCategoriasComponent)
  },
  {
    path: 'producto/:id',
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
  // Módulo Perfil de Usuario
  // =====================================================
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },

  // =====================================================
  // Módulo Administración (requiere ADMIN)
  // =====================================================
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
  },
  {
    path: 'admin/usuarios',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/usuario/usuario.component').then(m => m.UsuarioComponent)
  },
  {
    path: 'admin/backup',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/backup/backup.component').then(m => m.BackupComponent)
  },
  {
    path: 'admin/auditoria/usuarios',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/auditoria-usuario/auditoria-usuario.component').then(m => m.AuditoriaUsuarioComponent)
  },
  {
    path: 'admin/auditoria/productos',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/auditoria-producto/auditoria-producto.component').then(m => m.AuditoriaProductoComponent)
  },
  {
    path: 'admin/auditoria/categorias',
    canActivate: [adminGuard],
    loadComponent: () => import('./administracion/auditoria-categoria/auditoria-categoria.component').then(m => m.AuditoriaCategoriaComponent)
  },

  // =====================================================
  // Módulo Inventario (requiere ADMIN o INVENTARIO)
  // =====================================================
  {
    path: 'admin/productos',
    canActivate: [adminGuard],
    loadComponent: () => import('./inventario/producto/producto.component').then(m => m.ProductoComponent)
  },
  {
    path: 'admin/categorias',
    canActivate: [adminGuard],
    loadComponent: () => import('./inventario/categoria/categoria.component').then(m => m.CategoriaComponent)
  },

  // =====================================================
  // Módulo Ventas (Vendedor)
  // =====================================================
  {
    path: 'recojo-producto',
    canActivate: [vendedorGuard],
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
