import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay -->
    <div *ngIf="isOpen" 
         (click)="close.emit()" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300">
    </div>

    <!-- Drawer -->
    <div [class.translate-x-full]="!isOpen"
         class="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f172a] border-l border-white/10 z-[70] transition-transform duration-500 ease-out shadow-2xl flex flex-col">
      
      <!-- Header -->
      <div class="p-6 border-b border-white/10 flex items-center justify-between bg-[#1e293b]/50">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Tu Carrito
        </h2>
        <button (click)="close.emit()" class="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div *ngIf="(cartService.cart$ | async)?.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div class="p-6 bg-white/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-gray-400 text-lg">Tu carrito está vacío</p>
          <button (click)="close.emit()" class="text-blue-400 hover:text-blue-300 font-medium">Continuar comprando</button>
        </div>

        <div *ngFor="let item of cartService.cart$ | async" class="flex gap-4 group">
          <div class="h-20 w-20 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <img [src]="item.imagen_url" [alt]="item.nombre" class="h-full w-full object-cover group-hover:scale-110 transition-transform">
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-white font-medium line-clamp-1">{{item.nombre}}</h3>
              <p class="text-blue-400 font-bold mt-1 text-sm">{{item.precio | currency}}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center border border-white/10 rounded-lg overflow-hidden scale-90 -ml-2">
                <button (click)="cartService.updateQuantity(item.id_producto, -1)" class="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400">-</button>
                <span class="px-3 py-1 bg-white/5 text-white text-sm">{{item.cantidad}}</span>
                <button (click)="cartService.updateQuantity(item.id_producto, 1)" class="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400">+</button>
              </div>
              <button (click)="cartService.removeFromCart(item.id_producto)" class="text-gray-500 hover:text-red-400 transition-colors text-xs uppercase tracking-wider font-semibold">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div *ngIf="(cartService.cart$ | async)?.length! > 0" class="p-6 border-t border-white/10 bg-[#1e293b]/50">
        <div class="flex justify-between items-center mb-6">
          <span class="text-gray-400">Total estimado</span>
          <span class="text-2xl font-bold text-white">{{cartService.getTotal() | currency}}</span>
        </div>
        <button (click)="goToCheckout()" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
          Finalizar Compra
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(public cartService: CartService, private router: Router) {}

  goToCheckout() {
    this.close.emit();
    this.router.navigate(['/checkout']);
  }
}
