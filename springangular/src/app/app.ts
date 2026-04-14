import { Component, OnInit, signal } from '@angular/core';
import { Usuario } from './services/usuario';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './services/cart.service';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CartDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  usuarios: any[] = [];
  protected readonly title = signal('springangular');
  isCartOpen: boolean = false;

  constructor(
    private usuarioService: Usuario,
    public authService: AuthService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data as any[];
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
}
