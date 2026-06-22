import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderDetails } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 py-16 px-6 flex flex-col items-center font-sans">
      
      <!-- Success Icon -->
      <div class="mb-8 text-center animate-bounce-slow">
        <div class="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span class="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
        </div>
        <h1 class="text-3xl font-black text-white mt-6">¡Pedido Recibido!</h1>
        <p class="text-slate-400 mt-2">Gracias por confiar en ImportSmart.</p>
      </div>

      <!-- Ticket / Receipt -->
      <div *ngIf="orderDetails" class="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
        <div class="h-2 bg-blue-600"></div>

        <div class="p-10">
          <!-- Receipt Header -->
          <div class="text-center border-b border-slate-100 pb-8 mb-8">
            <h2 class="text-3xl font-black text-slate-900 italic tracking-tighter">IMPORTSMART</h2>
            <p class="text-xs text-slate-400 uppercase tracking-widest mt-1">Recibo de Venta Electrónico</p>
            
            <div class="mt-8 flex flex-col items-center">
              <span class="text-[10px] text-slate-400 font-bold uppercase">Número de Pedido</span>
              <span class="text-2xl font-mono font-bold text-blue-600">#{{ orderDetails.pedido.id_pedido }}</span>
            </div>
          </div>

          <!-- Items Detail -->
          <div class="space-y-4 mb-8">
             <div *ngFor="let item of orderDetails.detalles" class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <p class="text-sm font-bold text-slate-800 uppercase tracking-tight">{{ item.nombre_producto }}</p>
                  <p class="text-xs text-slate-400 italic">Cant: {{ item.cantidad }} x \${{ item.precio | number:'1.2-2' }}</p>
                </div>
                <span class="text-sm font-mono font-bold text-slate-900">\${{ (item.cantidad * item.precio) | number:'1.2-2' }}</span>
             </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-dashed border-slate-200 pt-6 space-y-2">
            <div class="flex justify-between text-xs text-slate-500 font-medium">
              <span>SUBTOTAL</span>
              <span>\${{ orderDetails.pedido.total / 1.18 | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-500 font-medium">
              <span>IGV (18%)</span>
              <span>\${{ (orderDetails.pedido.total * 0.18 / 1.18) | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between text-lg font-black text-slate-900 pt-4">
              <span>TOTAL</span>
              <span>\${{ orderDetails.pedido.total | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="mt-10 bg-slate-550/10 rounded-2xl p-6 space-y-3 border border-slate-100/50">
             <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-slate-400 text-sm">local_shipping</span>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enviar a:</span>
             </div>
             <p class="text-sm text-slate-800 font-medium pl-7">{{ orderDetails.pedido.nombreCompleto }}</p>
             <p class="text-xs text-slate-500 pl-7">{{ orderDetails.pedido.direccionEnvio }}</p>
             <div class="pt-2 border-t border-slate-100 mt-2 flex justify-between">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Pago: {{ orderDetails.pedido.metodoPago }}</span>
                <span class="text-[10px] text-slate-400 font-bold uppercase">{{ orderDetails.pedido.fecha | date:'short' }}</span>
             </div>
          </div>

          <!-- Footer Message -->
          <div class="mt-8 text-center">
            <p class="text-[10px] text-slate-400 font-medium px-8 leading-relaxed">
              Este es un recibo virtual oficial emitido por ImportSmart.
            </p>
          </div>
        </div>

        <!-- Decorative punch holes -->
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
           <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" class="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
        </div>
      </div>

      <button routerLink="/" class="mt-12 text-blue-400 hover:text-blue-300 font-bold underline decoration-blue-500/30 underline-offset-8">
        Volver a la tienda
      </button>

    </div>
  `,
  styles: [`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails?: OrderDetails;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cartService.getOrderDetails(+id).subscribe({
        next: (data: OrderDetails) => this.orderDetails = data,
        error: () => this.router.navigate(['/'])
      });
    }
  }
}
