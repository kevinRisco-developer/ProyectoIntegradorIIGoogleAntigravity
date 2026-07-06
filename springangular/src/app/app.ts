import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarritoComponent } from './cliente/carrito/carrito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CarritoComponent],
  template: `
    <!-- Barra de Navegación Global -->
    <app-navbar (toggleCart)="toggleCart()"></app-navbar>

    <!-- Contenido de la Página (Router Outlet) -->
    <main class="pt-16 min-h-screen bg-slate-950">
      <router-outlet></router-outlet>
    </main>

    <!-- Carrito Lateral (Drawer) -->
    <app-carrito [isOpen]="isCartOpen" (close)="isCartOpen = false"></app-carrito>

    <!-- Toast global (mensajes del carrito, p. ej. stock insuficiente) -->
    <div *ngIf="cartMessage()"
         class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-rose-950 border border-rose-800 text-rose-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold max-w-md">
      <span class="material-symbols-outlined text-base">error</span>
      <span>{{ cartMessage() }}</span>
    </div>

    <!-- Footer Global -->
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class App implements OnInit {
  protected readonly title = signal('springangular');
  isCartOpen: boolean = false;
  cartMessage = signal<string | null>(null);

  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    // Sincronizar carrito de localStorage si el usuario ya está logueado
    if (this.authService.isLoggedIn()) {
      this.cartService.syncLocalStorageToDb();
    }
    this.cartService.message$.subscribe(msg => this.cartMessage.set(msg));
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
}
