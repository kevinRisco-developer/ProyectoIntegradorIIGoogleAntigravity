import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-16 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-4xl font-black text-blue-400 tracking-tight">Mis Pedidos</h1>
            <p class="text-slate-400 text-sm mt-2 font-light">Revisa el historial de tus compras y su estado de envío</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-blue-400">receipt_long</span>
        </div>

        <div *ngIf="loading" class="space-y-6">
          <div *ngFor="let n of [1,2]" class="bg-slate-900 border border-slate-800 animate-pulse h-32 rounded-2xl"></div>
        </div>

        <div *ngIf="!loading && orders.length === 0" class="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">shopping_bag</span>
          <h3 class="text-xl font-bold text-slate-400">Aún no has realizado ningún pedido.</h3>
          <button routerLink="/" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all">
            Ir a la tienda
          </button>
        </div>

        <div *ngIf="!loading && orders.length > 0" class="space-y-6">
          <div *ngFor="let order of orders" 
               class="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl hover:border-blue-900/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-400">Pedido #{{ order.id_pedido }}</span>
                <span [class]="getStatusClass(order.estado)" class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border">
                  {{ order.estado }}
                </span>
              </div>
              <p class="text-xs text-slate-500">Fecha: {{ order.fecha | date:'dd/MM/yyyy HH:mm' }}</p>
              <div class="text-sm text-slate-300">
                <span class="font-semibold">Destinatario:</span> {{ order.nombreCompleto }} | <span class="font-semibold">Dirección:</span> {{ order.direccionEnvio }}
              </div>
            </div>

            <div class="flex flex-col md:items-end justify-between w-full md:w-auto gap-4">
              <div>
                <span class="text-xs text-slate-500 block uppercase tracking-wider">Total pagado</span>
                <span class="text-2xl font-black text-blue-400">\${{ order.total | number:'1.2-2' }}</span>
              </div>
              <button [routerLink]="['/order-confirmation', order.id_pedido]" 
                      class="bg-slate-950 border border-slate-800 hover:border-blue-600/40 text-blue-400 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all w-full md:w-auto justify-center">
                <span class="material-symbols-outlined text-xs">visibility</span>
                <span>Ver Detalles</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisPedidosComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getMisPedidos().subscribe({
      next: (data) => {
        // Ordenar del más reciente al más antiguo
        this.orders = data.sort((a, b) => b.id_pedido - a.id_pedido);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETADO':
        return 'bg-emerald-950/20 border-emerald-800 text-emerald-400';
      case 'PENDIENTE':
        return 'bg-amber-950/20 border-amber-800 text-amber-400';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  }
}
