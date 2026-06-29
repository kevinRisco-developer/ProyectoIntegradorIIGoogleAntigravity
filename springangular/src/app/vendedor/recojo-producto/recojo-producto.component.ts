import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-recojo-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Encabezado con estética Premium -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div class="flex items-center gap-2 text-blue-400 mb-1 text-sm font-semibold tracking-wider uppercase">
              <span class="material-symbols-outlined text-sm">local_shipping</span>
              Módulo de Ventas
            </div>
            <h1 class="text-4xl font-black text-white tracking-tight">Recojo Producto</h1>
            <p class="text-slate-400 text-sm mt-2 font-light">
              Visualiza y gestiona las entregas de pedidos que ya han sido pagados
            </p>
          </div>
          
          <!-- Filtro de Búsqueda -->
          <div class="relative w-full md:w-80">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">search</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              placeholder="Buscar por ID, cliente, teléfono..."
              class="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm placeholder-slate-500 text-white transition-all outline-none"
            />
          </div>
        </div>

        <!-- Toasts / Notificaciones flotantes -->
        <div *ngIf="toastMessage" 
             [class]="isToastError ? 'bg-red-950/60 border-red-800 text-red-300' : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'"
             class="mb-6 p-4 border rounded-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
          <span class="material-symbols-outlined">{{ isToastError ? 'error' : 'check_circle' }}</span>
          <span class="text-sm font-medium">{{ toastMessage }}</span>
        </div>

        <!-- Cargador de carga -->
        <div *ngIf="loading" class="space-y-6">
          <div *ngFor="let n of [1,2,3]" class="bg-slate-900 border border-slate-800 animate-pulse h-32 rounded-2xl"></div>
        </div>

        <!-- Sin Pedidos Disponibles -->
        <div *ngIf="!loading && filteredOrders.length === 0" class="text-center py-24 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
          <span class="material-symbols-outlined text-6xl text-slate-700 mb-4 animate-bounce">inventory_2</span>
          <h3 class="text-xl font-bold text-slate-400">No hay pedidos pendientes de entrega.</h3>
          <p class="text-slate-500 text-sm mt-2">Todos los pedidos pagados han sido despachados correctamente.</p>
        </div>

        <!-- Lista de Pedidos -->
        <div *ngIf="!loading && filteredOrders.length > 0" class="space-y-6">
          <div *ngFor="let order of filteredOrders" 
               class="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-900/30 transition-all duration-300">
            
            <!-- Fila principal del Pedido -->
            <div class="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div class="space-y-2">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="text-lg font-extrabold text-blue-400">Pedido #{{ order.id_pedido }}</span>
                  <span class="bg-blue-950/40 border border-blue-800/50 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {{ order.estado }}
                  </span>
                  <span class="text-xs text-slate-500">
                    {{ order.fecha | date:'dd/MM/yyyy HH:mm' }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-300">
                  <div><span class="text-slate-500">Cliente:</span> <strong class="text-white">{{ order.nombreCompleto }}</strong></div>
                  <div><span class="text-slate-500">Teléfono:</span> {{ order.telefono }}</div>
                  <div class="sm:col-span-2"><span class="text-slate-500">Dirección:</span> {{ order.direccionEnvio }}</div>
                  <div><span class="text-slate-500">Método de Pago:</span> <span class="text-slate-400 font-semibold">{{ order.metodoPago }}</span></div>
                </div>
              </div>

              <!-- Acciones e Importe -->
              <div class="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t border-slate-850 md:border-t-0">
                <div class="text-left md:text-right">
                  <span class="text-xs text-slate-500 block uppercase tracking-wider">Total</span>
                  <span class="text-3xl font-black text-white">\${{ order.total | number:'1.2-2' }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <!-- Detalle toggle -->
                  <button (click)="toggleDetails(order.id_pedido)" 
                          class="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                    <span class="material-symbols-outlined text-xs">{{ isExpanded(order.id_pedido) ? 'expand_less' : 'expand_more' }}</span>
                    <span>{{ isExpanded(order.id_pedido) ? 'Ocultar' : 'Ver Detalles' }}</span>
                  </button>

                  <!-- Botón de entregar -->
                  <button (click)="entregar(order.id_pedido)" 
                          [disabled]="submittingId === order.id_pedido"
                          class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50">
                    <span *ngIf="submittingId !== order.id_pedido" class="material-symbols-outlined text-xs">local_shipping</span>
                    <span *ngIf="submittingId === order.id_pedido" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Entregar</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Panel de detalles expandible -->
            <div *ngIf="isExpanded(order.id_pedido)" 
                 class="border-t border-slate-850/60 bg-slate-950/40 p-6 md:p-8 animate-in slide-in-from-top duration-300">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">list_alt</span>
                Productos del Pedido
              </h4>

              <div *ngIf="loadingDetails[order.id_pedido]" class="flex items-center gap-2 text-sm text-slate-400 py-4">
                <span class="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Cargando productos...</span>
              </div>

              <div *ngIf="!loadingDetails[order.id_pedido] && orderDetails[order.id_pedido]" class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-300">
                  <thead class="text-xs text-slate-500 uppercase border-b border-slate-800">
                    <tr>
                      <th class="py-3 px-4">Producto</th>
                      <th class="py-3 px-4 text-center">Cantidad</th>
                      <th class="py-3 px-4 text-right">Precio Unitario</th>
                      <th class="py-3 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of orderDetails[order.id_pedido].detalles" class="border-b border-slate-900/50 hover:bg-slate-900/20 transition-all">
                      <td class="py-3 px-4 font-medium text-white">{{ item.nombre_producto }}</td>
                      <td class="py-3 px-4 text-center font-bold">{{ item.cantidad }}</td>
                      <td class="py-3 px-4 text-right">\${{ item.precio | number:'1.2-2' }}</td>
                      <td class="py-3 px-4 text-right font-semibold text-blue-400">\${{ (item.precio * item.cantidad) | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      vertical-align: middle;
    }
  `]
})
export class RecojoProductoComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  submittingId: number | null = null;
  
  // Detalle expandible
  expandedOrders = new Set<number>();
  orderDetails: { [key: number]: any } = {};
  loadingDetails: { [key: number]: boolean } = {};

  // Feedback Toasts
  toastMessage: string | null = null;
  isToastError: boolean = false;
  private toastTimeout: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.cartService.getPedidosPagados().subscribe({
      next: (data) => {
        // Ordenar del más antiguo al más reciente (FIFO)
        this.orders = data.sort((a, b) => a.id_pedido - b.id_pedido);
        this.filterOrders();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos pagados:', err);
        this.showToast('No se pudieron cargar los pedidos pagados.', true);
        this.loading = false;
      }
    });
  }

  filterOrders() {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const q = this.searchQuery.toLowerCase().trim();
    this.filteredOrders = this.orders.filter(order => 
      order.id_pedido.toString().includes(q) ||
      order.nombreCompleto?.toLowerCase().includes(q) ||
      order.telefono?.toLowerCase().includes(q)
    );
  }

  onSearchChange() {
    this.filterOrders();
  }

  isExpanded(orderId: number): boolean {
    return this.expandedOrders.has(orderId);
  }

  toggleDetails(orderId: number) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
      if (!this.orderDetails[orderId]) {
        this.loadOrderDetails(orderId);
      }
    }
  }

  loadOrderDetails(orderId: number) {
    this.loadingDetails[orderId] = true;
    this.cartService.getOrderDetails(orderId).subscribe({
      next: (details) => {
        this.orderDetails[orderId] = details;
        this.loadingDetails[orderId] = false;
      },
      error: (err) => {
        console.error(`Error al cargar detalles de pedido #${orderId}:`, err);
        this.loadingDetails[orderId] = false;
      }
    });
  }

  entregar(orderId: number) {
    if (confirm(`¿Confirmar entrega para el Pedido #${orderId}?`)) {
      this.submittingId = orderId;
      this.cartService.entregarPedido(orderId).subscribe({
        next: (updatedOrder) => {
          this.showToast(`¡Pedido #${orderId} entregado con éxito!`, false);
          
          // Eliminar de la lista local
          this.orders = this.orders.filter(o => o.id_pedido !== orderId);
          this.filterOrders();
          
          // Limpiar referencias
          this.expandedOrders.delete(orderId);
          delete this.orderDetails[orderId];
          
          this.submittingId = null;
        },
        error: (err) => {
          console.error(`Error al entregar pedido #${orderId}:`, err);
          const errorMsg = err.error?.message || 'Error al procesar la entrega.';
          this.showToast(`Error: ${errorMsg}`, true);
          this.submittingId = null;
        }
      });
    }
  }

  showToast(message: string, isError: boolean) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage = message;
    this.isToastError = isError;

    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
