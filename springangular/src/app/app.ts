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

  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    // Sincronizar carrito de localStorage si el usuario ya está logueado
    if (this.authService.isLoggedIn()) {
      this.cartService.syncLocalStorageToDb();
    }
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
}
