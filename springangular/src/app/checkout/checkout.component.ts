import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#0f172a] py-12 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button (click)="router.navigate(['/catalog'])" class="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-white">Finalizar Compra</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Form -->
          <div class="lg:col-span-2 space-y-6">
            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="bg-[#1e293b] rounded-2xl p-8 border border-white/10 space-y-6 shadow-xl">
              <h2 class="text-xl font-semibold text-white mb-4">Detalles de Envío</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
                  <input type="text" formControlName="nombreCompleto" 
                         class="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Dirección de Envío</label>
                  <input type="text" formControlName="direccionEnvio" 
                         class="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                    <input type="text" formControlName="telefono" 
                           class="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Método de Pago</label>
                    <select formControlName="metodoPago" 
                            class="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option value="TARJETA">Tarjeta de Crédito / Débito</option>
                      <option value="PAYPAL">PayPal</option>
                      <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-400 text-sm flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Tu pedido será procesado de forma segura. El stock se reservará al confirmar la compra.</p>
              </div>

              <button [disabled]="checkoutForm.invalid || loading" 
                      class="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-lg">
                {{ loading ? 'Procesando Pedido...' : 'Realizar Pedido (' + (cartService.getTotal() | currency) + ')' }}
              </button>
            </form>
          </div>

          <!-- Summary -->
          <div class="space-y-6">
            <div class="bg-[#1e293b] rounded-2xl p-6 border border-white/10 shadow-xl">
              <h2 class="text-xl font-semibold text-white mb-6">Resumen del Pedido</h2>
              <div class="max-h-[300px] overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                <div *ngFor="let item of (cartService.cart$ | async)" class="flex gap-4">
                  <div class="h-16 w-16 bg-[#0f172a] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                    <img [src]="item.imagen_url" class="h-full w-full object-cover">
                  </div>
                  <div class="flex-1">
                    <h4 class="text-white text-sm font-medium line-clamp-1">{{item.nombre}}</h4>
                    <p class="text-gray-400 text-xs">Cant: {{item.cantidad}}</p>
                    <p class="text-blue-400 text-sm font-bold mt-1">{{item.precio * item.cantidad | currency}}</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3 pt-6 border-t border-white/10">
                <div class="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>{{cartService.getTotal() | currency}}</span>
                </div>
                <div class="flex justify-between text-gray-400 text-sm">
                  <span>Envío</span>
                  <span class="text-green-400">Gratis</span>
                </div>
                <div class="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span>{{cartService.getTotal() | currency}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  loading: boolean = false;

  constructor(
    public cartService: CartService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      direccionEnvio: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      metodoPago: ['TARJETA', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      if (items.length === 0) this.router.navigate(['/catalog']);
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) return;
    this.loading = true;

    const orderData: Order = {
      ...this.checkoutForm.value,
      total: this.cartService.getTotal()
    };

    this.cartService.placeOrder(orderData).subscribe({
      next: (order) => {
        this.router.navigate(['/order-confirmation', order.id_pedido]);
      },
      error: (err) => {
        alert("Error al realizar el pedido: " + (err.error || err.message));
        this.loading = false;
      }
    });
  }
}
