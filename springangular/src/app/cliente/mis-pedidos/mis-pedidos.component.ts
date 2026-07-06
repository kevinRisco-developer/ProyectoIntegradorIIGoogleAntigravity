import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-14 px-6">
      <div class="max-w-5xl mx-auto">

        <!-- Header -->
        <div class="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 class="text-4xl font-black text-blue-400 tracking-tight">Historial de Pedidos</h1>
            <p class="text-slate-400 text-sm mt-2 font-light max-w-xl">
              Revisa tus transacciones, el estado de tus envíos y el detalle de cada compra.
            </p>
          </div>
          <div class="hidden sm:block bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-right">
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Pedidos totales</span>
            <span class="text-2xl font-black text-white">{{ totalElements() }}</span>
          </div>
        </div>

        <!-- Skeleton -->
        <div *ngIf="loading()" class="space-y-5">
          <div *ngFor="let n of [1,2,3]" class="bg-slate-900 border border-slate-800 animate-pulse h-28 rounded-2xl"></div>
        </div>

        <!-- Vacío -->
        <div *ngIf="!loading() && orders().length === 0" class="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">shopping_bag</span>
          <h3 class="text-xl font-bold text-slate-400">Aún no has realizado ningún pedido.</h3>
          <button routerLink="/catalogo" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all">
            Ir al catálogo
          </button>
        </div>

        <!-- Lista -->
        <div *ngIf="!loading() && orders().length > 0" class="space-y-5">
          <div *ngFor="let order of orders()"
               class="bg-slate-900 border-l-4 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-5 transition-all hover:border-blue-500/50"
               [style.border-left-color]="accentColor(order.estado)"
               style="border-top:1px solid #1e2d40;border-right:1px solid #1e2d40;border-bottom:1px solid #1e2d40">

            <div class="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-slate-400">{{ statusIcon(order.estado) }}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Pedido</span>
                <span class="text-sm font-bold text-white">#IS-{{ order.id_pedido }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Fecha</span>
                <span class="text-sm text-slate-300">{{ order.fecha | date:'dd/MM/yyyy' }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Total</span>
                <span class="text-sm font-black text-blue-400">\${{ order.total | number:'1.2-2' }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Estado</span>
                <span [class]="statusClass(order.estado)" class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border inline-block mt-0.5">
                  {{ statusLabel(order.estado) }}
                </span>
              </div>
            </div>

            <button [routerLink]="['/order-confirmation', order.id_pedido]"
                    class="bg-slate-950 border border-slate-800 hover:border-blue-600/50 text-blue-400 font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all justify-center shrink-0">
              <span class="material-symbols-outlined text-sm">visibility</span> Ver detalles
            </button>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="!loading() && totalPages() > 1" class="flex items-center justify-center gap-2 mt-10">
          <button (click)="goTo(page() - 1)" [disabled]="page() === 0"
                  class="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-40 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <span class="text-sm text-slate-400 px-3">Página {{ page() + 1 }} de {{ totalPages() }}</span>
          <button (click)="goTo(page() + 1)" [disabled]="page() >= totalPages() - 1"
                  class="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 disabled:opacity-40 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class MisPedidosComponent implements OnInit {
  orders = signal<any[]>([]);
  loading = signal(true);
  page = signal(0);
  size = 6;
  totalElements = signal(0);
  totalPages = signal(0);

  constructor(private cartService: CartService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.cartService.getMisPedidos(this.page(), this.size).subscribe({
      next: (res) => {
        // La respuesta es una Page de Spring: { content, totalElements, totalPages }
        const content = res?.content ?? (Array.isArray(res) ? res : []);
        this.orders.set(content);
        this.totalElements.set(res?.totalElements ?? content.length);
        this.totalPages.set(res?.totalPages ?? 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goTo(p: number) {
    if (p < 0 || p >= this.totalPages()) return;
    this.page.set(p);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private norm(s: string): string { return (s || '').toUpperCase(); }

  statusLabel(s: string): string {
    switch (this.norm(s)) {
      case 'EN_PROCESO': return 'En proceso';
      case 'PAGADO': return 'Pagado';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return s;
    }
  }

  statusClass(s: string): string {
    switch (this.norm(s)) {
      case 'PAGADO':     return 'bg-blue-950/30 border-blue-800 text-blue-400';
      case 'ENTREGADO':  return 'bg-emerald-950/30 border-emerald-800 text-emerald-400';
      case 'EN_PROCESO': return 'bg-amber-950/30 border-amber-800 text-amber-400';
      case 'CANCELADO':  return 'bg-rose-950/30 border-rose-800 text-rose-400';
      default:           return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  }

  accentColor(s: string): string {
    switch (this.norm(s)) {
      case 'PAGADO':     return '#3b82f6';
      case 'ENTREGADO':  return '#10b981';
      case 'EN_PROCESO': return '#f59e0b';
      case 'CANCELADO':  return '#f43f5e';
      default:           return '#334155';
    }
  }

  statusIcon(s: string): string {
    switch (this.norm(s)) {
      case 'PAGADO':     return 'paid';
      case 'ENTREGADO':  return 'local_shipping';
      case 'EN_PROCESO': return 'hourglass_top';
      case 'CANCELADO':  return 'cancel';
      default:           return 'receipt_long';
    }
  }
}
