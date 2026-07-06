import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { UsuarioService } from '../../services/usuario.service';
import { BackupService } from '../../services/backup.service';
import { RecomendacionService } from '../../services/recomendacion.service';

interface PanelLink {
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 class="text-4xl font-black text-blue-400 tracking-tight">Panel del Sistema</h1>
            <p class="text-slate-400 text-sm mt-2 font-light">{{ subtitle }}</p>
            <span class="inline-block mt-3 text-[11px] font-bold uppercase tracking-widest bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
              Rol: {{ role }}
            </span>
          </div>

          <div class="flex gap-4" *ngIf="isAdmin">
            <button (click)="triggerMarketingBatch()" [disabled]="triggeringBatch"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 text-xs disabled:opacity-50">
              <span class="material-symbols-outlined text-sm animate-spin" *ngIf="triggeringBatch">sync</span>
              <span class="material-symbols-outlined text-sm" *ngIf="!triggeringBatch">campaign</span>
              <span>Disparar Correo Masivo Semanal</span>
            </button>
          </div>
        </div>

        <div *ngIf="alertMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-8 flex items-center gap-2">
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span>{{ alertMessage }}</span>
        </div>

        <!-- Métricas rápidas (según rol) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div *ngIf="canInventory" class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <span class="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Productos</span>
              <span class="text-2xl font-black text-white">{{ stats.totalProducts }}</span>
            </div>
          </div>

          <div *ngIf="canInventory" class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-teal-500/10 text-teal-400">
              <span class="material-symbols-outlined text-3xl">category</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Categorías</span>
              <span class="text-2xl font-black text-white">{{ stats.totalCategories }}</span>
            </div>
          </div>

          <div *ngIf="isAdmin" class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-purple-500/10 text-purple-400">
              <span class="material-symbols-outlined text-3xl">group</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Usuarios</span>
              <span class="text-2xl font-black text-white">{{ stats.totalUsers }}</span>
            </div>
          </div>

          <div *ngIf="isAdmin" class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
              <span class="material-symbols-outlined text-3xl">backup</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Backups Generados</span>
              <span class="text-2xl font-black text-white">{{ stats.totalBackups }}</span>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos (links según rol) -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Accesos rápidos</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <a *ngFor="let link of panelLinks" [routerLink]="link.route"
             class="bg-slate-900 border border-slate-800 hover:border-blue-600 p-6 rounded-2xl flex items-center gap-4 transition-colors group">
            <div class="p-3.5 rounded-xl" [ngClass]="link.color">
              <span class="material-symbols-outlined text-2xl">{{ link.icon }}</span>
            </div>
            <div class="flex-1">
              <span class="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{{ link.label }}</span>
            </div>
            <span class="material-symbols-outlined text-slate-600 group-hover:text-blue-400">chevron_right</span>
          </a>
        </div>

        <!-- Widget: Productos más vendidos (ADMIN y VENDEDOR) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div *ngIf="isAdmin || isVendedor" class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
            <h3 class="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400">trending_up</span>
              <span>Productos Más Vendidos</span>
            </h3>

            <div *ngIf="loadingFeatured" class="space-y-4">
              <div *ngFor="let n of [1,2,3]" class="bg-slate-950 border border-slate-800 animate-pulse h-14 rounded-xl"></div>
            </div>

            <div *ngIf="!loadingFeatured && featuredProducts.length === 0" class="text-slate-500 text-sm font-light">
              No hay registros de ventas.
            </div>

            <div *ngIf="!loadingFeatured && featuredProducts.length > 0" class="space-y-4">
              <div *ngFor="let prod of featuredProducts" class="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div>
                  <h4 class="text-sm font-bold text-white uppercase tracking-tight">{{ prod.nombre }}</h4>
                  <p class="text-xs text-slate-500 mt-1">Precio: \${{ prod.precio | number:'1.2-2' }}</p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-blue-400">{{ prod.totalVendido || 0 }} vendidos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget: Estado de servicios (ADMIN) -->
          <div *ngIf="isAdmin" class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
            <h3 class="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400">dns</span>
              <span>Integración de Servicios y Estado</span>
            </h3>

            <div class="space-y-6">
              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-medium text-white">Servidor Principal Java (Spring Boot)</span>
                </div>
                <span class="text-xs text-emerald-400 font-bold uppercase">Online</span>
              </div>

              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-medium text-white">Servidor de Base de Datos (MySQL)</span>
                </div>
                <span class="text-xs text-emerald-400 font-bold uppercase">Conectado</span>
              </div>

              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span class="text-sm font-medium text-white">Motor AI Python (FastAPI)</span>
                </div>
                <span class="text-xs text-blue-400 font-bold uppercase">Integrado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardAdminComponent implements OnInit {
  role = '';
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalBackups: 0
  };

  featuredProducts: any[] = [];
  panelLinks: PanelLink[] = [];
  alertMessage = '';
  triggeringBatch = false;
  loadingFeatured = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private usuarioService: UsuarioService,
    private backupService: BackupService,
    private recomendacionService: RecomendacionService
  ) {}

  get isAdmin(): boolean { return this.role === 'ADMIN'; }
  get isInventario(): boolean { return this.role === 'INVENTARIO'; }
  get isVendedor(): boolean { return this.role === 'VENDEDOR'; }
  get canInventory(): boolean { return this.isAdmin || this.isInventario; }

  get subtitle(): string {
    if (this.isAdmin) return 'Monitoreo del sistema, auditoría de logs, base de datos y automatizaciones.';
    if (this.isInventario) return 'Gestión de inventario: productos, categorías y auditorías.';
    if (this.isVendedor) return 'Gestión de ventas y recojo de productos.';
    return 'Panel del sistema.';
  }

  ngOnInit() {
    this.role = this.authService.getRole() || '';
    this.buildLinks();
    this.loadStats();
  }

  private buildLinks() {
    const links: PanelLink[] = [];
    if (this.canInventory) {
      links.push({ label: 'Productos', icon: 'inventory_2', route: '/admin/productos', color: 'bg-emerald-500/10 text-emerald-400' });
      links.push({ label: 'Categorías', icon: 'category', route: '/admin/categorias', color: 'bg-teal-500/10 text-teal-400' });
      links.push({ label: 'Auditorías', icon: 'manage_search', route: '/admin/auditoria/usuarios', color: 'bg-rose-500/10 text-rose-400' });
    }
    if (this.isAdmin) {
      links.push({ label: 'Gestión de Usuarios', icon: 'group', route: '/admin/usuarios', color: 'bg-purple-500/10 text-purple-400' });
      links.push({ label: 'Backups de BD', icon: 'backup', route: '/admin/backup', color: 'bg-amber-500/10 text-amber-400' });
    }
    if (this.isVendedor) {
      links.push({ label: 'Recojo de Productos', icon: 'local_shipping', route: '/recojo-producto', color: 'bg-cyan-500/10 text-cyan-400' });
    }
    this.panelLinks = links;
  }

  private loadStats() {
    // Métricas comunes a roles con inventario (endpoints GET públicos).
    if (this.canInventory) {
      this.productService.getProducts().subscribe(prods => this.stats.totalProducts = prods.length);
      this.productService.getCategories().subscribe(cats => this.stats.totalCategories = cats.length);
    }

    // Métricas solo-ADMIN (endpoints protegidos): se llaman solo si el rol lo permite.
    if (this.isAdmin) {
      this.usuarioService.getUsuarios().subscribe(users => this.stats.totalUsers = users.length);
      this.backupService.listarBackups().subscribe(res => this.stats.totalBackups = res.total);
    }

    // Productos más vendidos para ADMIN y VENDEDOR.
    if (this.isAdmin || this.isVendedor) {
      this.loadingFeatured = true;
      this.productService.getFeaturedProducts().subscribe({
        next: (res) => { this.featuredProducts = res; this.loadingFeatured = false; },
        error: () => { this.loadingFeatured = false; }
      });
    }
  }

  triggerMarketingBatch() {
    this.triggeringBatch = true;
    this.recomendacionService.triggerTestBatchEmail().subscribe({
      next: () => {
        this.triggeringBatch = false;
        this.alertMessage = 'El envío masivo semanal de correos de marketing se ha disparado con éxito.';
        setTimeout(() => this.alertMessage = '', 4000);
      },
      error: () => { this.triggeringBatch = false; }
    });
  }
}
