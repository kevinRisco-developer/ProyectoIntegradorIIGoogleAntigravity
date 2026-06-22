import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay -->
    <div *ngIf="isOpen" 
         (click)="close.emit()" 
         class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300">
    </div>

    <!-- Drawer -->
    <div [class.translate-x-full]="!isOpen"
         class="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-900 z-[70] transition-transform duration-500 ease-out shadow-2xl flex flex-col font-sans">
      
      <!-- Header -->
      <div class="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-900/50">
        <h2 class="text-xl font-black text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-400">shopping_cart</span>
          Tu Carrito
        </h2>
        <button (click)="close.emit()" class="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div *ngIf="(cartService.cart$ | async)?.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div class="p-6 bg-slate-900 rounded-full text-slate-500">
            <span class="material-symbols-outlined text-4xl">shopping_cart_off</span>
          </div>
          <p class="text-slate-400 text-lg">Tu carrito está vacío</p>
          <button (click)="close.emit()" class="text-blue-400 hover:text-blue-300 font-medium">Continuar comprando</button>
        </div>

        <div *ngFor="let item of cartService.cart$ | async" class="flex gap-4 group">
          <div class="h-20 w-20 flex-shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-850">
            <img [src]="item.imagen_url" [alt]="item.nombre" class="h-full w-full object-cover group-hover:scale-105 transition-transform">
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-white font-medium line-clamp-1">{{item.nombre}}</h3>
              <p class="text-blue-400 font-bold mt-1 text-sm">\${{item.precio | number:'1.2-2'}}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center border border-slate-850 bg-slate-950 rounded-lg overflow-hidden scale-90 -ml-2">
                <button (click)="cartService.updateQuantity(item.id_producto, -1)" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400">-</button>
                <span class="px-3.5 py-1 bg-slate-950 text-white text-sm font-semibold">{{item.cantidad}}</span>
                <button (click)="cartService.updateQuantity(item.id_producto, 1)" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400">+</button>
              </div>
              <button (click)="cartService.removeFromCart(item.id_producto)" class="text-slate-500 hover:text-rose-400 transition-colors text-xs uppercase tracking-wider font-semibold">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div *ngIf="(cartService.cart$ | async)?.length! > 0" class="p-6 border-t border-slate-900 bg-slate-900/50">
        <div class="flex justify-between items-center mb-6">
          <span class="text-slate-400">Total estimado</span>
          <span class="text-2xl font-black text-white">\${{cartService.getTotal() | number:'1.2-2'}}</span>
        </div>
        <button (click)="goToCheckout()" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2">
          <span>Finalizar Compra</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `
})
export class CarritoComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(public cartService: CartService, private router: Router) {}

  goToCheckout() {
    this.close.emit();
    this.router.navigate(['/checkout']);
  }
}
