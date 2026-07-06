import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';
import { ProductoDetalle, Category, ResenaResumen, ResenaEstado } from '../../models/product.model';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  styles: [`
    .pd-root { background:#060b14; min-height:100vh; color:#e2e8f0; font-family:'Inter',sans-serif; }
    .wrap { max-width:1180px; margin:0 auto; padding:1.5rem 1.5rem 4rem; }
    .crumb { display:flex; align-items:center; gap:.4rem; font-size:.75rem; color:#475569; margin-bottom:2rem; }
    .crumb a { color:#64748b; } .crumb a:hover { color:#38bdf8; } .crumb .cur { color:#38bdf8; font-weight:600; }

    .main-img { position:relative; border-radius:18px; overflow:hidden; background:#0d1728; border:1px solid #1e2d40; aspect-ratio:1/1; }
    .main-img img { width:100%; height:100%; object-fit:cover; }
    .badge-tl { position:absolute; top:16px; left:16px; background:#0d2545; color:#38bdf8; border:1px solid #1e4a7a; font-size:11px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; padding:5px 12px; border-radius:999px; display:inline-flex; align-items:center; gap:5px; }
    .badge-bl { position:absolute; bottom:16px; left:16px; background:rgba(6,11,20,.85); color:#818cf8; border:1px solid #312e81; font-size:11px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; padding:5px 12px; border-radius:999px; }
    .badge-sale { position:absolute; top:16px; right:16px; background:linear-gradient(135deg,#ef4444,#b91c1c); color:#fff; font-size:13px; font-weight:900; padding:5px 12px; border-radius:10px; }

    .thumbs { display:grid; grid-template-columns:repeat(4,1fr); gap:.75rem; margin-top:.9rem; }
    .thumb { position:relative; border-radius:12px; overflow:hidden; background:#0d1728; border:1px solid #1e2d40; aspect-ratio:1/1; cursor:pointer; transition:border-color .2s; }
    .thumb:hover { border-color:#38bdf8; } .thumb img { width:100%; height:100%; object-fit:cover; }

    .stars { display:flex; align-items:center; gap:1px; color:#fbbf24; }
    .stars .material-symbols-outlined { font-size:18px; } .stars .empty { color:#334155; }

    .h-title { font-size:2.1rem; font-weight:900; color:#f0f9ff; letter-spacing:-.02em; line-height:1.1; }
    .price-box { background:#0a1220; border:1px solid #1e2d40; border-radius:16px; padding:1.25rem 1.4rem; margin:1.25rem 0; }
    .price { font-size:2.3rem; font-weight:900; color:#f0f9ff; }
    .price-old { font-size:1.1rem; color:#475569; text-decoration:line-through; margin-left:10px; font-weight:600; }
    .offer { color:#f87171; font-size:.8125rem; font-weight:700; margin-top:.3rem; display:inline-flex; align-items:center; gap:5px; }

    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; margin:1.25rem 0; }
    .info-box { background:#0a1220; border:1px solid #1e2d40; border-radius:14px; padding:1rem 1.1rem; display:flex; align-items:center; gap:.75rem; }
    .info-box .ic { color:#38bdf8; font-size:22px; }
    .info-box .lbl { font-size:.65rem; color:#64748b; text-transform:uppercase; letter-spacing:.08em; font-weight:700; }
    .info-box .val { font-size:.95rem; color:#e2e8f0; font-weight:800; }

    .qty { display:flex; align-items:center; border:1px solid #1e3a5f; border-radius:12px; overflow:hidden; }
    .qty button { background:#0d1728; color:#94a3b8; border:none; width:42px; height:46px; cursor:pointer; font-size:18px; }
    .qty button:hover { color:#38bdf8; } .qty span { width:54px; text-align:center; font-weight:800; color:#f0f9ff; }

    .btn-cart { flex:1; background:linear-gradient(135deg,#0369a1,#1e40af); color:#fff; border:none; border-radius:12px; padding:0 1.5rem; height:46px; font-size:.9rem; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:opacity .2s; }
    .btn-cart:hover { opacity:.88; } .btn-cart:disabled { opacity:.4; cursor:not-allowed; }

    .link-row { display:flex; gap:1.5rem; margin-top:1rem; }
    .link-row a { color:#94a3b8; font-size:.8125rem; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; }
    .link-row a:hover { color:#38bdf8; }

    .tech { background:#08131f; border:1px solid #1e3a5f; border-left:3px solid #38bdf8; border-radius:14px; padding:1.25rem 1.4rem; margin-top:1.5rem; }
    .tech h4 { font-size:.72rem; text-transform:uppercase; letter-spacing:.1em; color:#38bdf8; font-weight:800; margin-bottom:1rem; display:flex; align-items:center; gap:6px; }
    .tech .row { display:flex; justify-content:space-between; padding:8px 0; border-top:1px solid #12233a; font-size:.85rem; }
    .tech .row:first-of-type { border-top:none; }
    .tech .k { color:#64748b; } .tech .v { color:#e2e8f0; font-weight:700; }

    .toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#052e16; border:1px solid #166534; color:#4ade80; padding:12px 22px; border-radius:12px; font-weight:700; font-size:.875rem; display:flex; align-items:center; gap:8px; z-index:60; }

    /* Reseñas */
    .rev-panel { background:#0a1220; border:1px solid #1e2d40; border-radius:18px; padding:1.75rem; }
    .rev-head { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; }
    .rev-title { font-size:1.4rem; font-weight:900; color:#f0f9ff; }
    .rev-avg { display:flex; align-items:center; gap:.9rem; }
    .rev-avg-num { font-size:2.4rem; font-weight:900; color:#fbbf24; line-height:1; }
    .rev-muted { font-size:.75rem; color:#64748b; }
    .stars.sm .material-symbols-outlined { font-size:15px; }

    .rev-form { background:#0d1728; border:1px solid #1e3a5f; border-radius:14px; padding:1.25rem; margin-bottom:1.5rem; }
    .rev-form-title { font-weight:800; color:#e2e8f0; font-size:.95rem; margin-bottom:.75rem; }
    .star-input { display:flex; align-items:center; margin-bottom:.9rem; }
    .star-pick { font-size:32px; color:#334155; cursor:pointer; transition:color .12s, transform .12s; }
    .star-pick:hover { transform:scale(1.12); }
    .star-pick.on { color:#fbbf24; }
    .rev-textarea { width:100%; background:#060b14; border:1.5px solid #1e3a5f; border-radius:10px; padding:10px 12px; color:#e2e8f0; font-size:.85rem; outline:none; resize:vertical; }
    .rev-textarea:focus { border-color:#38bdf8; }
    .rev-alert { margin-top:.75rem; padding:8px 12px; border-radius:10px; font-size:.8rem; font-weight:600; }
    .rev-alert.ok { background:#052e16; border:1px solid #166534; color:#4ade80; }
    .rev-alert.err { background:#2d0b0b; border:1px solid #991b1b; color:#f87171; }
    .rev-submit { margin-top:.9rem; background:linear-gradient(135deg,#0369a1,#1e40af); color:#fff; border:none; border-radius:11px; padding:10px 20px; font-weight:800; font-size:.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
    .rev-submit:disabled { opacity:.45; cursor:not-allowed; }

    .rev-note { display:flex; align-items:center; gap:.5rem; background:#08131f; border:1px solid #1e3a5f; color:#94a3b8; border-radius:12px; padding:12px 14px; font-size:.82rem; margin-bottom:1.5rem; }

    .rev-list { display:flex; flex-direction:column; gap:1rem; }
    .rev-item { display:flex; gap:.9rem; background:#0d1728; border:1px solid #1e2d40; border-radius:12px; padding:1rem 1.1rem; }
    .rev-avatar { width:38px; height:38px; border-radius:999px; background:#1e40af; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0; }
    .rev-item-head { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
    .rev-item-head strong { color:#e2e8f0; font-size:.875rem; }
    .rev-comment { color:#94a3b8; font-size:.85rem; line-height:1.6; margin-top:.35rem; }
    .rev-empty { color:#475569; font-size:.85rem; text-align:center; padding:1.5rem; border:1px dashed #1e2d40; border-radius:12px; }
  `],
  template: `
    <div class="pd-root">
      <div class="wrap">

        <!-- Breadcrumb -->
        <nav class="crumb">
          <a routerLink="/catalogo">Catálogo</a>
          <span class="material-symbols-outlined" style="font-size:14px">chevron_right</span>
          <a routerLink="/catalogo" [queryParams]="{ categoria: product()?.id_categoria }">{{ categoryName() }}</a>
          <span class="material-symbols-outlined" style="font-size:14px">chevron_right</span>
          <span class="cur">{{ product()?.nombre || 'Cargando...' }}</span>
        </nav>

        <!-- Skeleton -->
        <div *ngIf="loading()" style="display:grid;grid-template-columns:1fr 1fr;gap:2.5rem">
          <div style="background:#0d1728;border-radius:18px;aspect-ratio:1/1" class="animate-pulse"></div>
          <div style="display:flex;flex-direction:column;gap:1rem;padding-top:1rem">
            <div style="height:2rem;background:#0d1728;border-radius:10px;width:70%" class="animate-pulse"></div>
            <div style="height:4rem;background:#0d1728;border-radius:10px" class="animate-pulse"></div>
            <div style="height:8rem;background:#0d1728;border-radius:10px" class="animate-pulse"></div>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="!loading() && !product()" style="text-align:center;padding:6rem 0">
          <span class="material-symbols-outlined" style="font-size:4.5rem;color:#1e3a5f">error_outline</span>
          <h2 style="font-size:1.5rem;font-weight:800;color:#94a3b8;margin:1rem 0">Producto no encontrado</h2>
          <a routerLink="/catalogo" style="display:inline-block;padding:.75rem 1.5rem;border-radius:12px;font-weight:700;font-size:.875rem;background:#0d2545;color:#38bdf8;border:1px solid #1e4a7a">Volver al catálogo</a>
        </div>

        <!-- Detalle -->
        <div *ngIf="!loading() && product() as p" style="display:grid;grid-template-columns:1fr;gap:2.5rem"
             [style.grid-template-columns]="'repeat(auto-fit, minmax(320px, 1fr))'">

          <!-- Galería -->
          <div>
            <div class="main-img">
              <img [src]="selectedImg() || p.imagen_url || fallback" [alt]="p.nombre" (error)="onImgErr($event)">
              <span class="badge-tl"><span class="material-symbols-outlined" style="font-size:14px">bolt</span> Optimizado IA</span>
              <span *ngIf="p.descuento > 0" class="badge-sale">-{{ p.descuento }}% OFF</span>
              <span class="badge-bl">Cognitive Engine</span>
            </div>
            <!-- Thumbnails (galería visual del mismo producto) -->
            <div class="thumbs">
              <div class="thumb" *ngFor="let t of thumbs(p.imagen_url)" (click)="selectedImg.set(t)">
                <img [src]="t || fallback" [alt]="p.nombre" (error)="onImgErr($event)">
              </div>
            </div>
          </div>

          <!-- Info -->
          <div>
            <h1 class="h-title">{{ p.nombre }}</h1>

            <div style="display:flex;align-items:center;gap:.5rem;margin-top:.75rem">
              <div class="stars">
                <span *ngFor="let s of [0,1,2,3,4]" class="material-symbols-outlined"
                      [class.empty]="s >= starsFor(p.id_producto!)"
                      [style.font-variation-settings]="fillStyle(s < starsFor(p.id_producto!))">star</span>
              </div>
              <span style="font-size:.8125rem;color:#64748b">({{ reviewsFor(p.id_producto!) }} reseñas)</span>
            </div>

            <!-- Precio -->
            <div class="price-box">
              <span class="price">\${{ getPrecioFinal() | number:'1.2-2' }}</span>
              <span *ngIf="p.descuento > 0" class="price-old">\${{ p.precio | number:'1.2-2' }}</span>
              <div *ngIf="p.descuento > 0" class="offer">
                <span class="material-symbols-outlined" style="font-size:15px">schedule</span>
                Oferta de importación por tiempo limitado
              </div>
            </div>

            <p style="color:#94a3b8;font-size:.9rem;line-height:1.7">{{ p.descripcion }}</p>

            <!-- Info boxes -->
            <div class="info-grid">
              <div class="info-box">
                <span class="material-symbols-outlined ic">inventory</span>
                <div>
                  <div class="lbl">Stock disponible</div>
                  <div class="val">{{ p.stock > 0 ? p.stock + ' unidades' : 'Agotado' }}</div>
                </div>
              </div>
              <div class="info-box">
                <span class="material-symbols-outlined ic">local_shipping</span>
                <div>
                  <div class="lbl">Envío global</div>
                  <div class="val">3-5 días</div>
                </div>
              </div>
            </div>

            <!-- Cantidad + carrito -->
            <div style="display:flex;gap:.9rem;align-items:stretch">
              <div class="qty">
                <button (click)="decreaseQty()">−</button>
                <span>{{ quantity }}</span>
                <button (click)="increaseQty()">+</button>
              </div>
              <button class="btn-cart" (click)="addToCart()" [disabled]="p.disponibilidad !== 'En Stock'">
                <span class="material-symbols-outlined" style="font-size:18px">shopping_cart</span>
                {{ p.disponibilidad === 'En Stock' ? 'Agregar al carrito' : 'Agotado' }}
              </button>
            </div>

            <div class="link-row">
              <a><span class="material-symbols-outlined" style="font-size:16px">favorite</span> Añadir a favoritos</a>
              <a><span class="material-symbols-outlined" style="font-size:16px">compare_arrows</span> Comparar especificaciones</a>
            </div>

            <!-- Inteligencia Técnica (datos reales del producto) -->
            <div class="tech">
              <h4><span class="material-symbols-outlined" style="font-size:14px">memory</span> Inteligencia Técnica</h4>
              <div class="row"><span class="k">SKU</span><span class="v">#{{ p.id_producto }}</span></div>
              <div class="row"><span class="k">Categoría</span><span class="v">{{ categoryName() }}</span></div>
              <div class="row"><span class="k">Disponibilidad</span><span class="v">{{ p.disponibilidad }}</span></div>
              <div class="row"><span class="k">Stock en almacén</span><span class="v">{{ p.stock }} u.</span></div>
              <div class="row" *ngIf="p.descuento > 0"><span class="k">Descuento aplicado</span><span class="v">{{ p.descuento }}%</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== RESEÑAS ===================== -->
      <div class="wrap" *ngIf="!loading() && product() as p" style="padding-top:0">
        <div class="rev-panel">
          <div class="rev-head">
            <h3 class="rev-title">Reseñas y calificación</h3>
            <div class="rev-avg" *ngIf="resumen()">
              <span class="rev-avg-num">{{ (resumen()!.promedio || 0) | number:'1.1-1' }}</span>
              <div>
                <div class="stars">
                  <span *ngFor="let s of [1,2,3,4,5]" class="material-symbols-outlined"
                        [class.empty]="s > round(resumen()!.promedio)"
                        [style.font-variation-settings]="fillStyle(s <= round(resumen()!.promedio))">star</span>
                </div>
                <span class="rev-muted">{{ resumen()!.total }} reseña{{ resumen()!.total === 1 ? '' : 's' }}</span>
              </div>
            </div>
          </div>

          <!-- Formulario: solo CLIENTE que compró el producto -->
          <form *ngIf="isCliente() && estado()?.puede" [formGroup]="reviewForm" (ngSubmit)="submitResena(p.id_producto!)" class="rev-form">
            <h4 class="rev-form-title">{{ estado()?.yaReseno ? 'Edita tu reseña' : 'Deja tu reseña' }}</h4>
            <div class="star-input">
              <span *ngFor="let s of [1,2,3,4,5]" class="material-symbols-outlined star-pick"
                    [class.on]="s <= (hoverStar() || reviewForm.value.calificacion)"
                    [style.font-variation-settings]="fillStyle(s <= (hoverStar() || reviewForm.value.calificacion))"
                    (click)="setCalificacion(s)" (mouseenter)="hoverStar.set(s)" (mouseleave)="hoverStar.set(0)">star</span>
              <span class="rev-muted" style="margin-left:.5rem">{{ reviewForm.value.calificacion || 0 }}/5</span>
            </div>
            <textarea formControlName="comentario" rows="3" placeholder="Cuéntanos tu experiencia con este producto (opcional)" class="rev-textarea"></textarea>
            <div *ngIf="reviewMsg() === 'ok'" class="rev-alert ok">¡Reseña guardada correctamente!</div>
            <div *ngIf="reviewMsg() && reviewMsg() !== 'ok'" class="rev-alert err">{{ reviewMsg() }}</div>
            <button type="submit" [disabled]="reviewForm.invalid || submittingResena()" class="rev-submit">
              <span *ngIf="submittingResena()" class="material-symbols-outlined" style="font-size:16px;animation:spin 1s linear infinite">sync</span>
              {{ submittingResena() ? 'Guardando...' : (estado()?.yaReseno ? 'Actualizar reseña' : 'Publicar reseña') }}
            </button>
          </form>

          <!-- Avisos cuando no puede reseñar -->
          <div *ngIf="!isLoggedIn()" class="rev-note">
            <span class="material-symbols-outlined" style="font-size:16px">login</span>
            <span>Inicia sesión como cliente para dejar una reseña.</span>
          </div>
          <div *ngIf="isLoggedIn() && isCliente() && estado() && !estado()!.puede" class="rev-note">
            <span class="material-symbols-outlined" style="font-size:16px">lock</span>
            <span>Solo puedes reseñar productos que has comprado.</span>
          </div>

          <!-- Lista de reseñas -->
          <div *ngIf="resumen() && resumen()!.resenas.length > 0" class="rev-list">
            <div class="rev-item" *ngFor="let r of resumen()!.resenas">
              <div class="rev-avatar">{{ (r.nombre_usuario || 'C').charAt(0).toUpperCase() }}</div>
              <div style="flex:1;min-width:0">
                <div class="rev-item-head">
                  <strong>{{ r.nombre_usuario }}</strong>
                  <div class="stars sm">
                    <span *ngFor="let s of [1,2,3,4,5]" class="material-symbols-outlined"
                          [class.empty]="s > r.calificacion"
                          [style.font-variation-settings]="fillStyle(s <= r.calificacion)">star</span>
                  </div>
                  <span class="rev-muted">{{ r.fecha | date:'dd/MM/yyyy' }}</span>
                </div>
                <p *ngIf="r.comentario" class="rev-comment">{{ r.comentario }}</p>
              </div>
            </div>
          </div>
          <div *ngIf="resumen() && resumen()!.resenas.length === 0" class="rev-empty">
            Aún no hay reseñas para este producto. ¡Sé el primero en calificarlo!
          </div>
        </div>
      </div>

      <div *ngIf="addedToCart" class="toast">
        <span class="material-symbols-outlined" style="font-size:18px">check_circle</span>
        Agregado al carrito
      </div>
    </div>
  `
})
export class ProductoDetalleComponent implements OnInit {
  fallback = 'https://placehold.co/600x600/0d1728/38bdf8?text=Producto';

  product = signal<ProductoDetalle | null>(null);
  selectedImg = signal<string>('');
  loading = signal(true);
  quantity = 1;
  addedToCart = false;

  // Reseñas
  resumen = signal<ResenaResumen | null>(null);
  estado = signal<ResenaEstado | null>(null);
  hoverStar = signal(0);
  submittingResena = signal(false);
  reviewMsg = signal<string | null>(null);
  reviewForm: FormGroup;

  private catMap = signal<Record<number, string>>({});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private resenaService: ResenaService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      calificacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['']
    });
  }

  ngOnInit() {
    this.productService.getPublicCategories().subscribe({
      next: (cats: Category[]) => {
        const map: Record<number, string> = {};
        cats.forEach(c => { if (c.id_categoria != null) map[c.id_categoria] = c.nombre; });
        this.catMap.set(map);
      },
      error: () => {}
    });

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) { this.loading.set(false); return; }
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.selectedImg.set('');
    this.productService.getPublicProductDetail(id).subscribe({
      next: (p) => { this.product.set(p); this.loading.set(false); this.loadResenas(id); },
      error: (err) => { console.error('Error loading product detail', err); this.product.set(null); this.loading.set(false); }
    });
  }

  loadResenas(id: number) {
    this.resenaService.getResenasProducto(id).subscribe({
      next: (res) => this.resumen.set(res),
      error: () => this.resumen.set({ promedio: 0, total: 0, resenas: [] })
    });
    // Estado (puede/ya reseñó) solo tiene sentido para un CLIENTE autenticado.
    if (this.isCliente()) {
      this.resenaService.getEstado(id).subscribe({
        next: (est) => {
          this.estado.set(est);
          if (est?.miResena) {
            this.reviewForm.patchValue({
              calificacion: est.miResena.calificacion,
              comentario: est.miResena.comentario || ''
            });
          }
        },
        error: () => this.estado.set(null)
      });
    }
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  isCliente(): boolean { return this.authService.isCliente(); }

  setCalificacion(n: number) {
    this.reviewForm.patchValue({ calificacion: n });
  }

  submitResena(idProducto: number) {
    if (this.reviewForm.invalid) return;
    this.submittingResena.set(true);
    this.reviewMsg.set(null);
    const { calificacion, comentario } = this.reviewForm.value;
    this.resenaService.crearResena({ id_producto: idProducto, calificacion, comentario: comentario || '' }).subscribe({
      next: () => {
        this.submittingResena.set(false);
        this.reviewMsg.set('ok');
        this.loadResenas(idProducto);
        setTimeout(() => this.reviewMsg.set(null), 3000);
      },
      error: (err) => {
        this.submittingResena.set(false);
        this.reviewMsg.set(err?.error?.message || 'No se pudo guardar la reseña');
      }
    });
  }

  categoryName(): string {
    const p = this.product();
    if (!p) return '';
    return this.catMap()[p.id_categoria] || 'Logistics Hardware';
  }

  // Galería visual: usamos la imagen del producto (no hay múltiples imágenes en el modelo).
  thumbs(url: string): string[] {
    return [url, url, url, url];
  }

  onImgErr(ev: Event) { (ev.target as HTMLImageElement).src = this.fallback; }

  fillStyle(filled: boolean): string { return filled ? "'FILL' 1" : "'FILL' 0"; }
  starsFor(id: number): number { return 4 + (id % 2); }
  reviewsFor(id: number): number { return 20 + (id * 29) % 480; }
  round(v: number): number { return Math.round(v || 0); }

  getPrecioFinal(): number {
    const p = this.product();
    if (!p) return 0;
    if (!p.descuento || p.descuento <= 0) return p.precio;
    return p.precio * (1 - p.descuento / 100);
  }

  increaseQty() {
    const maxStock = this.product()?.stock ?? 0;
    if (this.quantity < maxStock) this.quantity++;
  }

  decreaseQty() { if (this.quantity > 1) this.quantity--; }

  addToCart(buyNow = false) {
    const p = this.product();
    if (!p || p.disponibilidad !== 'En Stock') return;

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(p);
    }
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 3000);

    if (buyNow) this.router.navigate(['/checkout']);
  }
}
