import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg h-16 flex justify-between items-center px-8 font-sans font-bold text-white transition-all duration-300">
      <div class="text-2xl font-black text-blue-400 tracking-tighter cursor-pointer flex items-center gap-2 hover:opacity-90" routerLink="/">
        <span class="material-symbols-outlined text-blue-400 animate-pulse">speed</span>
        <span>ImportSmart</span>
      </div>
      
      <nav class="hidden md:flex gap-8 items-center text-sm">
        <a class="text-slate-300 hover:text-blue-400 duration-300 ease-in-out cursor-pointer" routerLink="/" fragment="inicio" routerLinkActive="text-blue-400 font-bold">Inicio</a>
        <a class="text-slate-300 hover:text-blue-400 duration-300 ease-in-out cursor-pointer" routerLink="/" fragment="productos" routerLinkActive="text-blue-400 font-bold">Productos</a>
        <a class="text-slate-300 hover:text-blue-400 duration-300 ease-in-out cursor-pointer" routerLink="/" fragment="nosotros" routerLinkActive="text-blue-400 font-bold">Sobre Nosotros</a>
        <a class="text-slate-300 hover:text-blue-400 duration-300 ease-in-out cursor-pointer" routerLink="/" fragment="contacto" routerLinkActive="text-blue-400 font-bold">Contacto</a>
      </nav>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 relative">
          <!-- Admin Dashboard Shortcut -->
          <button class="hover:scale-110 duration-300 flex items-center p-2 rounded-lg hover:bg-slate-800" routerLink="/admin" *ngIf="isAdmin()" title="Panel de Administración">
            <span class="material-symbols-outlined text-amber-500">admin_panel_settings</span>
          </button>
          
          <!-- Cart Icon -->
          <button (click)="onToggleCart()" class="relative p-2 text-slate-300 hover:text-blue-400 transition-all rounded-lg hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span *ngIf="cartService.getCartCount() > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full">
              {{ cartService.getCartCount() }}
            </span>
          </button>

          <!-- User Identity & Menu -->
          <div class="flex items-center gap-2 relative">
            <span *ngIf="authService.isLoggedIn()" class="text-sm font-semibold text-slate-300 hidden sm:block">
              {{ authService.getUsername() }}
            </span>
            <button (click)="isUserMenuOpen = !isUserMenuOpen" class="hover:scale-105 duration-300 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-800">
              <span class="material-symbols-outlined text-blue-400">account_circle</span>
              <span class="material-symbols-outlined text-xs text-slate-400 transition-transform" [class.rotate-180]="isUserMenuOpen">expand_more</span>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="isUserMenuOpen" (mouseleave)="isUserMenuOpen = false" class="absolute top-12 right-0 w-48 bg-slate-800 text-white shadow-2xl rounded-xl border border-slate-700 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <ng-container *ngIf="!authService.isLoggedIn(); else loggedInMenu">
                <button routerLink="/login" (click)="isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">login</span> Iniciar Sesión
                </button>
                <button routerLink="/register" (click)="isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">person_add</span> Registrarse
                </button>
              </ng-container>
              <ng-template #loggedInMenu>
                <button routerLink="/profile" (click)="isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">person</span> Mi Perfil
                </button>
                <button routerLink="/recomendaciones" (click)="isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">featured_play_list</span> Mis Recomendaciones
                </button>
                <button routerLink="/mis-pedidos" (click)="isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">receipt_long</span> Mis Pedidos
                </button>
                <hr class="my-1 border-slate-700">
                <button (click)="logout(); isUserMenuOpen = false" class="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">logout</span> Cerrar Sesión
                </button>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .material-symbols-outlined {
      font-size: 22px;
    }
  `]
})
export class NavbarComponent {
  isUserMenuOpen = false;

  @Output() toggleCart = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onToggleCart() {
    this.toggleCart.emit();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
