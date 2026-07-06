import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    .ck-root { background:#060b14; min-height:100vh; color:#e2e8f0; font-family:'Inter',sans-serif; }
    .wrap { max-width:1080px; margin:0 auto; padding:2rem 1.5rem 4rem; }
    .panel { background:#0a1220; border:1px solid #1e2d40; border-radius:18px; padding:1.75rem; }
    .lbl { display:block; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#64748b; margin-bottom:.5rem; }
    .inp { width:100%; background:#0d1728; border:1.5px solid #1e3a5f; border-radius:12px; padding:12px 14px; color:#e2e8f0; font-size:.875rem; outline:none; transition:border-color .2s; }
    .inp:focus { border-color:#38bdf8; }
    .inp::placeholder { color:#475569; }
    .err { color:#f87171; font-size:.72rem; margin-top:.3rem; }

    .steps { display:flex; align-items:center; margin-bottom:2.5rem; }
    .step { display:flex; flex-direction:column; align-items:center; gap:.4rem; }
    .dot { width:36px; height:36px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:.9rem; border:2px solid #1e3a5f; background:#0d1728; color:#64748b; }
    .dot.active { background:linear-gradient(135deg,#0369a1,#1e40af); border-color:transparent; color:#fff; }
    .dot.done { background:#052e16; border-color:#166534; color:#4ade80; }
    .step .cap { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#64748b; }
    .step .cap.on { color:#38bdf8; }
    .bar { flex:1; height:2px; background:#1e2d40; margin:0 .75rem; margin-bottom:1.3rem; }
    .bar.on { background:#38bdf8; }

    .radio { display:flex; gap:.9rem; align-items:center; background:#0d1728; border:1.5px solid #1e3a5f; border-radius:12px; padding:14px 16px; cursor:pointer; transition:border-color .2s; }
    .radio.sel { border-color:#38bdf8; background:#0d2545; }
    .radio .rc { width:18px; height:18px; border-radius:999px; border:2px solid #29405c; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
    .radio.sel .rc { border-color:#38bdf8; } .radio.sel .rc::after { content:''; width:8px; height:8px; border-radius:999px; background:#38bdf8; }

    .btn-primary { background:linear-gradient(135deg,#0369a1,#1e40af); color:#fff; border:none; border-radius:12px; padding:0 1.6rem; height:48px; font-weight:800; font-size:.9rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:opacity .2s; }
    .btn-primary:hover { opacity:.9; } .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
    .btn-ghost { background:transparent; color:#94a3b8; border:1px solid #1e3a5f; border-radius:12px; padding:0 1.4rem; height:48px; font-weight:700; font-size:.85rem; cursor:pointer; }
    .btn-ghost:hover { color:#38bdf8; border-color:#38bdf8; }

    .sum-item { display:flex; gap:.75rem; align-items:center; }
    .sum-item img { width:48px; height:48px; border-radius:10px; object-fit:cover; background:#0d1728; border:1px solid #1e2d40; }
  `],
  template: `
    <div class="ck-root">
      <div class="wrap">

        <div style="display:grid;gap:2rem" [style.grid-template-columns]="'repeat(auto-fit, minmax(300px, 1fr))'">

          <!-- Columna izquierda: stepper + pasos -->
          <div style="min-width:0">
            <!-- Stepper -->
            <div class="steps">
              <div class="step">
                <div class="dot" [class.active]="step()===1" [class.done]="step()>1">
                  <span *ngIf="step()>1" class="material-symbols-outlined" style="font-size:18px">check</span>
                  <span *ngIf="step()<=1">1</span>
                </div>
                <span class="cap" [class.on]="step()===1">Dirección</span>
              </div>
              <div class="bar" [class.on]="step()>1"></div>
              <div class="step">
                <div class="dot" [class.active]="step()===2" [class.done]="step()>2">
                  <span *ngIf="step()>2" class="material-symbols-outlined" style="font-size:18px">check</span>
                  <span *ngIf="step()<=2">2</span>
                </div>
                <span class="cap" [class.on]="step()===2">Envío</span>
              </div>
              <div class="bar" [class.on]="step()>2"></div>
              <div class="step">
                <div class="dot" [class.active]="step()===3">3</div>
                <span class="cap" [class.on]="step()===3">Pago</span>
              </div>
            </div>

            <form [formGroup]="form">
              <!-- PASO 1: Dirección -->
              <div *ngIf="step()===1" class="panel">
                <h2 style="font-size:1.6rem;font-weight:900;color:#f0f9ff;margin-bottom:.35rem">Dirección de Envío</h2>
                <p style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem">Confirma dónde deseas recibir tu cargamento inteligente.</p>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                  <div>
                    <label class="lbl">Nombre completo</label>
                    <input class="inp" formControlName="nombreCompleto" placeholder="John Doe">
                    <p *ngIf="invalid('nombreCompleto')" class="err">Requerido</p>
                  </div>
                  <div>
                    <label class="lbl">Correo electrónico</label>
                    <input class="inp" formControlName="correo" placeholder="john@company.com">
                    <p *ngIf="invalid('correo')" class="err">Correo inválido</p>
                  </div>
                  <div style="grid-column:1 / -1">
                    <label class="lbl">Dirección</label>
                    <input class="inp" formControlName="direccion" placeholder="Calle de la Innovación 42, Edificio B">
                    <p *ngIf="invalid('direccion')" class="err">Requerido</p>
                  </div>
                  <div>
                    <label class="lbl">Ciudad</label>
                    <input class="inp" formControlName="ciudad" placeholder="Barcelona">
                    <p *ngIf="invalid('ciudad')" class="err">Requerido</p>
                  </div>
                  <div>
                    <label class="lbl">Código postal</label>
                    <input class="inp" formControlName="codigoPostal" placeholder="08001">
                    <p *ngIf="invalid('codigoPostal')" class="err">Requerido</p>
                  </div>
                  <div>
                    <label class="lbl">Teléfono de contacto</label>
                    <input class="inp" formControlName="telefono" placeholder="987654321">
                    <p *ngIf="invalid('telefono')" class="err">Solo números</p>
                  </div>
                </div>

                <div style="display:flex;justify-content:flex-end;margin-top:1.75rem">
                  <button type="button" class="btn-primary" (click)="next()">
                    Continuar al Envío <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
                  </button>
                </div>
              </div>

              <!-- PASO 2: Envío -->
              <div *ngIf="step()===2" class="panel">
                <h2 style="font-size:1.6rem;font-weight:900;color:#f0f9ff;margin-bottom:.35rem">Método de Envío</h2>
                <p style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem">Selecciona cómo quieres recibir tu pedido.</p>

                <div style="display:flex;flex-direction:column;gap:.9rem">
                  <label class="radio" [class.sel]="form.value.metodoEnvio==='ESTANDAR'">
                    <input type="radio" formControlName="metodoEnvio" value="ESTANDAR" hidden>
                    <span class="rc"></span>
                    <span class="material-symbols-outlined" style="color:#38bdf8">local_shipping</span>
                    <div style="flex:1">
                      <div style="font-weight:800;color:#e2e8f0;font-size:.9rem">Logística Global AI (Estándar)</div>
                      <div style="font-size:.75rem;color:#64748b">Entrega en 3-5 días · Rastreo inteligente</div>
                    </div>
                    <span style="color:#4ade80;font-weight:800;font-size:.85rem">Gratis</span>
                  </label>
                  <label class="radio" [class.sel]="form.value.metodoEnvio==='EXPRESS'">
                    <input type="radio" formControlName="metodoEnvio" value="EXPRESS" hidden>
                    <span class="rc"></span>
                    <span class="material-symbols-outlined" style="color:#818cf8">bolt</span>
                    <div style="flex:1">
                      <div style="font-weight:800;color:#e2e8f0;font-size:.9rem">Express Priority</div>
                      <div style="font-size:.75rem;color:#64748b">Entrega en 24-48 h</div>
                    </div>
                    <span style="color:#94a3b8;font-weight:800;font-size:.85rem">Gratis</span>
                  </label>
                </div>

                <div style="display:flex;justify-content:space-between;margin-top:1.75rem">
                  <button type="button" class="btn-ghost" (click)="back()">Volver</button>
                  <button type="button" class="btn-primary" (click)="next()">
                    Continuar al Pago <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
                  </button>
                </div>
              </div>

              <!-- PASO 3: Pago -->
              <div *ngIf="step()===3" class="panel">
                <h2 style="font-size:1.6rem;font-weight:900;color:#f0f9ff;margin-bottom:.35rem">Pago</h2>
                <p style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem">Selecciona tu método de pago (simulado).</p>

                <label class="lbl">Método de pago</label>
                <select class="inp" formControlName="metodoPago">
                  <option value="TARJETA">Tarjeta de Crédito / Débito (Simulado)</option>
                  <option value="PAYPAL">PayPal (Simulado)</option>
                  <option value="TRANSFERENCIA">Transferencia Bancaria (Simulada)</option>
                </select>

                <div style="margin-top:1.25rem;padding:1rem;background:#08131f;border:1px solid #1e3a5f;border-radius:12px;color:#38bdf8;font-size:.78rem;display:flex;gap:.6rem">
                  <span class="material-symbols-outlined" style="font-size:18px">lock</span>
                  <span>Al confirmar, el pedido pasa a <b>EN_PROCESO</b> y, tras el pago simulado, a <b>PAGADO</b>. El stock se descuenta de forma atómica.</span>
                </div>

                <div style="display:flex;justify-content:space-between;margin-top:1.75rem">
                  <button type="button" class="btn-ghost" (click)="back()">Volver</button>
                  <button type="button" class="btn-primary" (click)="submit()" [disabled]="loading()">
                    <span *ngIf="loading()" class="material-symbols-outlined" style="font-size:18px;animation:spin 1s linear infinite">sync</span>
                    {{ loading() ? 'Procesando...' : 'Finalizar Compra' }}
                    <span *ngIf="!loading()" class="material-symbols-outlined" style="font-size:18px">check_circle</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Columna derecha: resumen -->
          <div style="min-width:0">
            <div class="panel" style="position:sticky;top:1.5rem">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
                <h3 style="font-size:1.15rem;font-weight:900;color:#f0f9ff">Resumen del Pedido</h3>
                <span style="background:#0d2545;color:#38bdf8;border:1px solid #1e4a7a;font-size:.7rem;font-weight:800;padding:3px 10px;border-radius:999px">{{ count() }} ítems</span>
              </div>

              <div style="display:flex;flex-direction:column;gap:.9rem;max-height:260px;overflow-y:auto;margin-bottom:1.25rem">
                <div class="sum-item" *ngFor="let item of (cartService.cart$ | async)">
                  <img [src]="item.imagen_url || fallback" (error)="$any($event.target).src=fallback">
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:700;color:#e2e8f0;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ item.nombre }}</div>
                    <div style="font-size:.72rem;color:#64748b">Cant: {{ item.cantidad }}</div>
                  </div>
                  <div style="font-weight:800;color:#f0f9ff;font-size:.85rem">\${{ item.precio * item.cantidad | number:'1.2-2' }}</div>
                </div>
              </div>

              <div style="border-top:1px solid #1e2d40;padding-top:1rem;display:flex;flex-direction:column;gap:.6rem">
                <div style="display:flex;justify-content:space-between;font-size:.85rem;color:#94a3b8"><span>Subtotal</span><span>\${{ cartService.getTotal() | number:'1.2-2' }}</span></div>
                <div style="display:flex;justify-content:space-between;font-size:.85rem;color:#94a3b8"><span>Impuestos (IVA)</span><span>Incluido</span></div>
                <div style="display:flex;justify-content:space-between;font-size:.85rem;color:#94a3b8"><span>Envío</span><span style="color:#4ade80">Gratis</span></div>
                <div style="display:flex;justify-content:space-between;font-weight:900;color:#f0f9ff;font-size:1.25rem;border-top:1px solid #1e2d40;padding-top:.75rem;margin-top:.25rem">
                  <span>Total</span><span style="color:#38bdf8">\${{ cartService.getTotal() | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  fallback = 'https://placehold.co/100x100/0d1728/38bdf8?text=•';
  form: FormGroup;
  step = signal(1);
  loading = signal(false);

  constructor(
    public cartService: CartService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      metodoEnvio: ['ESTANDAR', Validators.required],
      metodoPago: ['TARJETA', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      if (items.length === 0 && !this.loading()) this.router.navigate(['/catalogo']);
    });
  }

  count(): number { return this.cartService.getCartCount(); }

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  private step1Controls = ['nombreCompleto', 'correo', 'direccion', 'ciudad', 'codigoPostal', 'telefono'];

  next() {
    if (this.step() === 1) {
      const invalid = this.step1Controls.some(c => this.form.get(c)!.invalid);
      if (invalid) { this.step1Controls.forEach(c => this.form.get(c)!.markAsTouched()); return; }
    }
    this.step.set(Math.min(3, this.step() + 1));
  }

  back() { this.step.set(Math.max(1, this.step() - 1)); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const v = this.form.value;
    const orderData: Order = {
      nombreCompleto: v.nombreCompleto,
      direccionEnvio: `${v.direccion}, ${v.ciudad} ${v.codigoPostal}`,
      telefono: v.telefono,
      metodoPago: v.metodoPago,
      total: this.cartService.getTotal()
    };

    this.cartService.placeOrder(orderData).subscribe({
      next: (order: any) => this.router.navigate(['/order-confirmation', order.id_pedido]),
      error: (err: any) => {
        this.loading.set(false);
        alert('Error al realizar el pedido: ' + (err?.error?.message || err?.error || err?.message || 'Inténtalo de nuevo'));
      }
    });
  }
}
