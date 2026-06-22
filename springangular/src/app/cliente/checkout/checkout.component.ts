import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-12 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button (click)="router.navigate(['/'])" class="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h1 class="text-3xl font-black tracking-tight text-white">Finalizar Compra</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Form -->
          <div class="lg:col-span-2 space-y-6">
            <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="bg-slate-900 rounded-2xl p-8 border border-slate-850 space-y-6 shadow-xl">
              <h2 class="text-xl font-bold text-white mb-4">Detalles de Envío</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                  <input type="text" formControlName="nombreCompleto" 
                         class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                         placeholder="Ingresa tu nombre completo">
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dirección de Envío</label>
                  <input type="text" formControlName="direccionEnvio" 
                         class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                         placeholder="Calle Principal, Nro de Casa, Ciudad">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Teléfono de Contacto</label>
                    <input type="text" formControlName="telefono" 
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                           placeholder="987654321">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Método de Pago</label>
                    <select formControlName="metodoPago" 
                            class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm">
                      <option value="TARJETA">Tarjeta de Crédito / Débito (Simulado)</option>
                      <option value="PAYPAL">PayPal (Simulado)</option>
                      <option value="TRANSFERENCIA">Transferencia Bancaria (Simulada)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-blue-950/20 rounded-xl border border-blue-900/30 text-blue-400 text-xs flex gap-3">
                <span class="material-symbols-outlined text-sm flex-shrink-0">info</span>
                <p>Tu pedido se procesará de forma segura y el stock se reservará al confirmar la compra.</p>
              </div>

              <button [disabled]="checkoutForm.invalid || loading" 
                      class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 transition-all text-base">
                {{ loading ? 'Procesando Pedido...' : 'Realizar Pedido (' + (cartService.getTotal() | number:'1.2-2') + ')' }}
              </button>
            </form>
          </div>

          <!-- Summary -->
          <div class="space-y-6">
            <div class="bg-slate-900 rounded-2xl p-6 border border-slate-850 shadow-xl">
              <h2 class="text-xl font-bold text-white mb-6">Resumen de Pedido</h2>
              <div class="max-h-[300px] overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                <div *ngFor="let item of (cartService.cart$ | async)" class="flex gap-4">
                  <div class="h-16 w-16 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 border border-slate-850">
                    <img [src]="item.imagen_url" class="h-full w-full object-cover">
                  </div>
                  <div class="flex-1">
                    <h4 class="text-white text-sm font-semibold line-clamp-1">{{item.nombre}}</h4>
                    <p class="text-slate-400 text-xs">Cant: {{item.cantidad}}</p>
                    <p class="text-blue-400 text-sm font-bold mt-1">\${{item.precio * item.cantidad | number:'1.2-2'}}</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3 pt-6 border-t border-slate-850">
                <div class="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>\${{cartService.getTotal() | number:'1.2-2'}}</span>
                </div>
                <div class="flex justify-between text-slate-400 text-sm">
                  <span>Envío</span>
                  <span class="text-emerald-400">Gratis</span>
                </div>
                <div class="flex justify-between text-white font-bold text-lg pt-3 border-t border-slate-850">
                  <span>Total</span>
                  <span>\${{cartService.getTotal() | number:'1.2-2'}}</span>
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
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
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
      if (items.length === 0) this.router.navigate(['/']);
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
      next: (order: any) => {
        this.router.navigate(['/order-confirmation', order.id_pedido]);
      },
      error: (err: any) => {
        alert("Error al realizar el pedido: " + (err.error || err.message));
        this.loading = false;
      }
    });
  }
}
