import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .cat-root { background:#060b14; min-height:100vh; color:#e2e8f0; font-family:'Inter',sans-serif; }
    .wrap { max-width:1280px; margin:0 auto; padding:0 1.5rem; }

    .crumb { display:flex; align-items:center; gap:.4rem; font-size:.75rem; color:#475569; padding:1.75rem 0 .5rem; }
    .crumb a { color:#64748b; } .crumb a:hover { color:#38bdf8; } .crumb .cur { color:#38bdf8; font-weight:600; }

    .title { font-size:2.4rem; font-weight:900; color:#f0f9ff; letter-spacing:-.02em; }
    .title span { background:linear-gradient(135deg,#38bdf8,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .subtitle { color:#64748b; font-size:.875rem; margin-top:.35rem; }

    .search { position:relative; flex:1; min-width:220px; }
    .search input { width:100%; border-radius:12px; padding:12px 16px 12px 42px; background:#0d1728; border:1.5px solid #1e3a5f; color:#e2e8f0; font-size:.875rem; outline:none; transition:border-color .2s; }
    .search input:focus { border-color:#38bdf8; }
    .search .ic { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#38bdf8; font-size:18px; }
    .search .sp { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:#38bdf8; animation:spin 1s linear infinite; }
    @keyframes spin { to { transform:translateY(-50%) rotate(360deg); } }

    .sortbox { position:relative; }
    .sortbox select { appearance:none; background:#0d1728; border:1.5px solid #1e3a5f; color:#94a3b8; border-radius:12px; padding:12px 38px 12px 16px; font-size:.8125rem; font-weight:600; outline:none; cursor:pointer; }
    .sortbox .ch { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#64748b; pointer-events:none; font-size:18px; }

    .panel { background:#0a1220; border:1px solid #1e2d40; border-radius:16px; padding:1.25rem 1.25rem 1.5rem; }
    .panel h4 { font-size:.9375rem; font-weight:800; color:#e2e8f0; margin-bottom:1rem; }

    .checkrow { display:flex; align-items:center; gap:.6rem; padding:7px 0; cursor:pointer; color:#94a3b8; font-size:.8125rem; font-weight:500; transition:color .15s; }
    .checkrow:hover { color:#e2e8f0; }
    .checkrow .box { width:18px; height:18px; border-radius:6px; border:1.5px solid #29405c; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .checkrow.on { color:#38bdf8; } .checkrow.on .box { background:#0ea5e9; border-color:#0ea5e9; }
    .checkrow .box .material-symbols-outlined { font-size:14px; color:#fff; }

    .range input[type=range] { width:100%; accent-color:#38bdf8; height:4px; }
    .range .labels { display:flex; justify-content:space-between; font-size:.75rem; color:#64748b; margin-top:.4rem; }
    .range .cur { text-align:center; color:#38bdf8; font-weight:800; font-size:.8125rem; margin-top:.5rem; }

    .ai-tip { background:#080f1a; border:1px solid #1e3a5f; border-radius:14px; padding:1.1rem; }

    .grid { display:grid; grid-template-columns:repeat(1,1fr); gap:1.25rem; }
    @media (min-width:640px)  { .grid { grid-template-columns:repeat(2,1fr); } }
    @media (min-width:1100px) { .grid { grid-template-columns:repeat(3,1fr); } }

    .card { background:#0d1728; border:1px solid #1e2d40; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .25s, box-shadow .25s, transform .25s; }
    .card:hover { border-color:#38bdf8; box-shadow:0 8px 40px rgba(56,189,248,.08); transform:translateY(-3px); }
    .card-img { position:relative; height:190px; background:#060b14; cursor:pointer; overflow:hidden; }
    .card-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
    .card:hover .card-img img { transform:scale(1.06); }

    .tag { position:absolute; top:12px; left:12px; font-size:10px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:4px 9px; border-radius:8px; }
    .tag-stock { background:#052e16; color:#4ade80; border:1px solid #166534; }
    .tag-low   { background:#3f2a00; color:#fbbf24; border:1px solid #92400e; }
    .tag-out   { background:#2d0000; color:#f87171; border:1px solid #991b1b; }
    .tag-sale  { position:absolute; top:12px; right:12px; background:linear-gradient(135deg,#ef4444,#b91c1c); color:#fff; }

    .stars { display:flex; align-items:center; gap:1px; color:#fbbf24; }
    .stars .material-symbols-outlined { font-size:15px; }
    .stars .empty { color:#334155; }
    .rev { font-size:.7rem; color:#64748b; margin-left:5px; }

    .pname { font-weight:700; font-size:.9375rem; color:#e2e8f0; cursor:pointer; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
    .pname:hover { color:#38bdf8; }
    .pdesc { font-size:.75rem; color:#64748b; line-height:1.65; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

    .price { font-size:1.35rem; font-weight:900; color:#f0f9ff; }
    .price-old { font-size:.8125rem; color:#475569; text-decoration:line-through; margin-left:6px; font-weight:600; }

    .btn-cart { background:linear-gradient(135deg,#0369a1,#1e40af); color:#fff; border:none; border-radius:11px; padding:9px 14px; font-size:.75rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:5px; transition:opacity .2s; white-space:nowrap; }
    .btn-cart:hover { opacity:.88; } .btn-cart:disabled { opacity:.4; cursor:not-allowed; }

    .pag-btn { width:38px; height:38px; border-radius:10px; border:1px solid #1e2d40; background:#0d1728; color:#94a3b8; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:700; font-size:.875rem; transition:all .2s; }
    .pag-btn:hover:not(:disabled) { border-color:#38bdf8; color:#38bdf8; } .pag-btn:disabled { opacity:.4; cursor:not-allowed; }
    .pag-btn.active { background:linear-gradient(135deg,#0369a1,#1e40af); color:#fff; border-color:transparent; }

    .skeleton { background:#0d1728; border-radius:16px; height:360px; animation:pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    .empty { background:#080f1a; border:1px dashed #1e2d40; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5rem 2rem; }
  `],
  template: `
    <div class="cat-root">
      <div class="wrap">

        <!-- Breadcrumb -->
        <nav class="crumb">
          <a routerLink="/">Home</a>
          <span class="material-symbols-outlined" style="font-size:14px">chevron_right</span>
          <a routerLink="/catalogo">Global Sourcing</a>
          <span class="material-symbols-outlined" style="font-size:14px">chevron_right</span>
          <span class="cur">Catálogo</span>
        </nav>

        <!-- Título + búsqueda + sort -->
        <div style="display:flex;flex-wrap:wrap;gap:1.25rem;justify-content:space-between;align-items:flex-end;margin-bottom:2rem">
          <div>
            <h1 class="title">Catálogo <span>Industrial</span></h1>
            <p class="subtitle">Mostrando {{ displayedProducts().length }} de {{ totalElements() }} productos smart-vetted</p>
          </div>
          <div style="display:flex;gap:.75rem;align-items:center;flex:1;justify-content:flex-end;flex-wrap:wrap">
            <div class="search">
              <span class="material-symbols-outlined ic">search</span>
              <input type="text" [(ngModel)]="searchInput" (input)="onSearchInput()" placeholder="Buscar catálogo...">
              <span *ngIf="loading()" class="material-symbols-outlined sp">sync</span>
            </div>
            <div class="sortbox">
              <select [(ngModel)]="sortBy" (change)="onSort()">
                <option value="relevancia">Ordenar por: Más relevante</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
              <span class="material-symbols-outlined ch">expand_more</span>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:1.75rem;padding-bottom:4rem">

          <!-- Sidebar -->
          <aside style="width:100%;max-width:250px;min-width:200px;display:flex;flex-direction:column;gap:1.25rem">

            <!-- Categorías -->
            <div class="panel">
              <h4>Categorías</h4>
              <div class="checkrow" [class.on]="selectedCategoryId() === 0" (click)="selectCategory(0)">
                <span class="box"><span class="material-symbols-outlined" *ngIf="selectedCategoryId() === 0">check</span></span>
                Todos los productos
              </div>
              <div class="checkrow" *ngFor="let cat of categories()"
                   [class.on]="selectedCategoryId() === cat.id_categoria"
                   (click)="selectCategory(cat.id_categoria!)">
                <span class="box"><span class="material-symbols-outlined" *ngIf="selectedCategoryId() === cat.id_categoria">check</span></span>
                {{ cat.nombre }}
              </div>
            </div>

            <!-- Rango de precio -->
            <div class="panel range">
              <h4>Rango de precio</h4>
              <input type="range" min="0" max="10000" step="100" [(ngModel)]="maxPrice" (input)="onPriceChange()">
              <div class="labels"><span>$0</span><span>$10,000+</span></div>
              <div class="cur">{{ maxPrice >= 10000 ? 'Sin límite' : ('Hasta $' + (maxPrice | number)) }}</div>
            </div>

            <!-- Smart Insights -->
            <div class="ai-tip">
              <span class="material-symbols-outlined" style="color:#818cf8;font-size:1.4rem;display:block;margin-bottom:.5rem">auto_awesome</span>
              <h4 style="font-weight:700;font-size:.8125rem;color:#c7d2fe;margin-bottom:.35rem">Smart Insights</h4>
              <p style="font-size:.6875rem;color:#64748b;line-height:1.6">
                Los precios de electrónica podrían subir ~5% el próximo mes. Asegura tu pedido ahora.
              </p>
            </div>
          </aside>

          <!-- Grid -->
          <div style="flex:1;min-width:0">

            <!-- Skeleton -->
            <div *ngIf="loading()" class="grid">
              <div *ngFor="let n of [1,2,3,4,5,6]" class="skeleton"></div>
            </div>

            <!-- Vacío -->
            <div *ngIf="!loading() && displayedProducts().length === 0" class="empty">
              <span class="material-symbols-outlined" style="font-size:3.5rem;color:#1e3a5f;margin-bottom:.75rem">inventory_2</span>
              <h3 style="font-weight:700;font-size:1.1rem;color:#475569">Sin resultados</h3>
              <p style="font-size:.875rem;color:#334155;margin-top:.25rem">Ajusta la búsqueda, categoría o el rango de precio</p>
              <button (click)="clearSearch()" style="margin-top:1rem;padding:.5rem 1.25rem;border-radius:12px;font-size:.8125rem;font-weight:700;background:#0d2545;color:#38bdf8;border:1px solid #1e4a7a;cursor:pointer">
                Limpiar filtros
              </button>
            </div>

            <!-- Cards -->
            <div *ngIf="!loading() && displayedProducts().length > 0" class="grid">
              <div *ngFor="let p of displayedProducts()" class="card">

                <div class="card-img" [routerLink]="['/producto', p.id_producto]">
                  <img [src]="p.imagen_url || fallback" [alt]="p.nombre"
                       (error)="$any($event.target).src=fallback">
                  <span *ngIf="p.stock > 10" class="tag tag-stock">En stock</span>
                  <span *ngIf="p.stock > 0 && p.stock <= 10" class="tag tag-low">Pocas unidades</span>
                  <span *ngIf="p.stock === 0" class="tag tag-out">Agotado</span>
                  <span *ngIf="p.descuento && p.descuento > 0" class="tag tag-sale">-{{ p.descuento }}%</span>
                </div>

                <div style="padding:1.1rem;display:flex;flex-direction:column;flex:1;gap:.6rem">
                  <!-- Rating (decorativo) -->
                  <div style="display:flex;align-items:center">
                    <div class="stars">
                      <span *ngFor="let s of [0,1,2,3,4]" class="material-symbols-outlined"
                            [class.empty]="s >= starsFor(p.id_producto!)"
                            [style.font-variation-settings]="s < starsFor(p.id_producto!) ? &quot;'FILL' 1&quot; : &quot;'FILL' 0&quot;">star</span>
                    </div>
                    <span class="rev">({{ reviewsFor(p.id_producto!) }})</span>
                  </div>

                  <p class="pname" [routerLink]="['/producto', p.id_producto]">{{ p.nombre }}</p>
                  <p class="pdesc" style="flex:1">{{ p.descripcion }}</p>

                  <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:auto">
                    <div>
                      <span class="price">\${{ precioFinal(p) | number:'1.2-2' }}</span>
                      <span *ngIf="p.descuento && p.descuento > 0" class="price-old">\${{ p.precio | number:'1.2-2' }}</span>
                    </div>
                    <button class="btn-cart" (click)="addToCart(p)" [disabled]="p.stock === 0">
                      <span class="material-symbols-outlined" style="font-size:15px">shopping_cart</span>
                      {{ p.stock === 0 ? 'Agotado' : 'Agregar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paginación -->
            <div *ngIf="totalPages() > 1" style="display:flex;align-items:center;justify-content:center;gap:.5rem;margin-top:2.5rem">
              <button class="pag-btn" (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 0">
                <span class="material-symbols-outlined" style="font-size:18px">chevron_left</span>
              </button>
              <button *ngFor="let pg of pageNumbers()" class="pag-btn" [class.active]="pg === currentPage()" (click)="goToPage(pg)">
                {{ pg + 1 }}
              </button>
              <button class="pag-btn" (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages() - 1">
                <span class="material-symbols-outlined" style="font-size:18px">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VistaProductosComponent implements OnInit, OnDestroy {
  fallback = 'https://placehold.co/400x300/0d1728/38bdf8?text=Producto';

  products    = signal<Product[]>([]);
  categories  = signal<Category[]>([]);
  loading     = signal(true);
  selectedCategoryId = signal(0);
  currentPage = signal(0);
  totalElements = signal(0);
  totalPages  = signal(0);
  pageSize    = 12;

  searchInput = '';
  sortBy = 'relevancia';
  maxPrice = 10000;

  // Refina (precio + orden) la página actual del servidor en el cliente.
  private priceMax = signal(10000);
  private sort = signal('relevancia');
  displayedProducts = computed(() => {
    let arr = [...this.products()];
    const max = this.priceMax();
    if (max < 10000) arr = arr.filter(p => this.precioFinal(p) <= max);
    switch (this.sort()) {
      case 'precio_asc':  arr.sort((a, b) => this.precioFinal(a) - this.precioFinal(b)); break;
      case 'precio_desc': arr.sort((a, b) => this.precioFinal(b) - this.precioFinal(a)); break;
      case 'nombre':      arr.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
    }
    return arr;
  });

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  pageNumbers = computed(() => {
    const total = this.totalPages(), current = this.currentPage();
    const range: number[] = [];
    const start = Math.max(0, current - 2), end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  });

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.currentPage.set(0); this.loadProducts(); });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['categoria']) this.selectedCategoryId.set(Number(params['categoria']));
      if (params['buscar'])    this.searchInput = params['buscar'];
    });

    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadCategories() {
    this.productService.getPublicCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: err  => console.error('Error loading categories', err)
    });
  }

  loadProducts() {
    this.loading.set(true);
    const page = this.currentPage(), size = this.pageSize;
    const catId = this.selectedCategoryId(), query = this.searchInput.trim();

    const req$ = query
      ? this.productService.searchPublicProducts(query, page, size)
      : catId > 0
        ? this.productService.getPublicProductsByCategory(catId, page, size)
        : this.productService.getPublicProducts(page, size);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.products.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearchInput() { this.searchSubject.next(this.searchInput); }
  onSort() { this.sort.set(this.sortBy); }
  onPriceChange() { this.priceMax.set(Number(this.maxPrice)); }

  selectCategory(id: number) {
    this.selectedCategoryId.set(id);
    this.currentPage.set(0);
    this.searchInput = '';
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearSearch() {
    this.searchInput = '';
    this.selectedCategoryId.set(0);
    this.currentPage.set(0);
    this.maxPrice = 10000; this.priceMax.set(10000);
    this.sortBy = 'relevancia'; this.sort.set('relevancia');
    this.loadProducts();
  }

  addToCart(product: Product) {
    if (product.stock === 0) return;
    this.cartService.addToCart(product);
  }

  precioFinal(p: Product): number {
    if (!p.descuento || p.descuento <= 0) return p.precio;
    return p.precio * (1 - p.descuento / 100);
  }

  // Rating/reseñas decorativos, derivados del id de forma estable (no hay tabla de reseñas).
  starsFor(id: number): number { return 4 + (id % 2); }         // 4 o 5 estrellas
  reviewsFor(id: number): number { return 20 + (id * 29) % 480; }
}
