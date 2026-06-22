import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { ProductService } from '../../services/product.service';
import { UsuarioService } from '../../services/usuario.service';
import { BackupService } from '../../services/backup.service';
import { RecomendacionService } from '../../services/recomendacion.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <!-- Sidebar de Navegación -->
      <app-sidebar></app-sidebar>

      <!-- Contenido Principal -->
      <main class="flex-1 p-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 class="text-4xl font-black text-blue-400 tracking-tight">Panel Administrativo</h1>
            <p class="text-slate-400 text-sm mt-2 font-light">
              Monitoreo del sistema, auditoría de logs, base de datos y automatizaciones.
            </p>
          </div>

          <div class="flex gap-4">
            <!-- Disparador Manual de Batch Marketing -->
            <button (click)="triggerMarketingBatch()" [disabled]="triggeringBatch"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 text-xs disabled:opacity-50">
              <span class="material-symbols-outlined text-sm animate-spin" *ngIf="triggeringBatch">sync</span>
              <span class="material-symbols-outlined text-sm" *ngIf="!triggeringBatch">campaign</span>
              <span>Disparar Correo Masivo Semanal</span>
            </button>
          </div>
        </div>

        <!-- Alertas -->
        <div *ngIf="alertMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-8 flex items-center gap-2">
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span>{{ alertMessage }}</span>
        </div>

        <!-- Métricas Rápidas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <!-- Tarjeta 1: Productos -->
          <div class="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <span class="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Productos</span>
              <span class="text-2xl font-black text-white">{{ stats.totalProducts }}</span>
            </div>
          </div>

          <!-- Tarjeta 2: Categorías -->
          <div class="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-teal-500/10 text-teal-400">
              <span class="material-symbols-outlined text-3xl">category</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Categorías</span>
              <span class="text-2xl font-black text-white">{{ stats.totalCategories }}</span>
            </div>
          </div>

          <!-- Tarjeta 3: Usuarios -->
          <div class="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-purple-500/10 text-purple-400">
              <span class="material-symbols-outlined text-3xl">group</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Usuarios</span>
              <span class="text-2xl font-black text-white">{{ stats.totalUsers }}</span>
            </div>
          </div>

          <!-- Tarjeta 4: Backups -->
          <div class="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center gap-4">
            <div class="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
              <span class="material-symbols-outlined text-3xl">backup</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Backups Generados</span>
              <span class="text-2xl font-black text-white">{{ stats.totalBackups }}</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Widgets / Charts Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Widget 1: Productos Destacados -->
          <div class="bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-lg">
            <h3 class="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400">trending_up</span>
              <span>Productos Más Vendidos</span>
            </h3>
            
            <div *ngIf="loadingFeatured" class="space-y-4">
              <div *ngFor="let n of [1,2,3]" class="bg-slate-950 border border-slate-850 animate-pulse h-14 rounded-xl"></div>
            </div>

            <div *ngIf="!loadingFeatured && featuredProducts.length === 0" class="text-slate-500 text-sm font-light">
              No hay registros de ventas.
            </div>

            <div *ngIf="!loadingFeatured && featuredProducts.length > 0" class="space-y-4">
              <div *ngFor="let prod of featuredProducts" class="flex justify-between items-center bg-slate-950 p-4 border border-slate-850 rounded-xl">
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

          <!-- Widget 2: Estado de Servidores / Conectividad -->
          <div class="bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-lg">
            <h3 class="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-400">dns</span>
              <span>Integración de Servicios y Estado</span>
            </h3>
            
            <div class="space-y-6">
              <!-- Item: Spring Boot Backend -->
              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-medium text-white">Servidor Principal Java (Spring Boot)</span>
                </div>
                <span class="text-xs text-emerald-400 font-bold uppercase">Online</span>
              </div>

              <!-- Item: Database Server -->
              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-medium text-white">Servidor de Base de Datos (MySQL)</span>
                </div>
                <span class="text-xs text-emerald-400 font-bold uppercase">Conectado</span>
              </div>

              <!-- Item: Python AI Model API -->
              <div class="flex justify-between items-center bg-slate-950 p-4 border border-slate-850 rounded-xl">
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
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalBackups: 0
  };

  featuredProducts: any[] = [];
  alertMessage = '';
  triggeringBatch = false;
  loadingFeatured = true;

  constructor(
    private productService: ProductService,
    private usuarioService: UsuarioService,
    private backupService: BackupService,
    private recomendacionService: RecomendacionService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.productService.getProducts().subscribe(prods => {
      this.stats.totalProducts = prods.length;
    });

    this.productService.getCategories().subscribe(cats => {
      this.stats.totalCategories = cats.length;
    });

    this.usuarioService.getUsuarios().subscribe(users => {
      this.stats.totalUsers = users.length;
    });

    this.backupService.listarBackups().subscribe(res => {
      this.stats.totalBackups = res.total;
    });

    this.productService.getFeaturedProducts().subscribe({
      next: (res) => {
        this.featuredProducts = res;
        this.loadingFeatured = false;
      },
      error: () => {
        this.loadingFeatured = false;
      }
    });
  }

  triggerMarketingBatch() {
    this.triggeringBatch = true;
    this.recomendacionService.triggerTestBatchEmail().subscribe({
      next: (res) => {
        this.triggeringBatch = false;
        this.alertMessage = 'El envío masivo semanal de correos de marketing se ha disparado con éxito.';
        setTimeout(() => this.alertMessage = '', 4000);
      },
      error: () => {
        this.triggeringBatch = false;
      }
    });
  }
}
