import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside *ngIf="isAdmin()" class="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen p-6 font-sans">
      <div class="mb-8">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Módulos Administrativos</h3>
      </div>
      
      <nav class="space-y-2">
        <a routerLink="/admin" routerLinkActive="bg-blue-600 text-white" [routerLinkActiveOptions]="{exact: true}" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-blue-400">dashboard</span>
          <span>Dashboard</span>
        </a>

        <a routerLink="/admin/usuarios" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-purple-400">group</span>
          <span>Gestión de Usuarios</span>
        </a>

        <a routerLink="/admin/productos" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-emerald-400">inventory_2</span>
          <span>Productos</span>
        </a>

        <a routerLink="/admin/categorias" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-teal-400">category</span>
          <span>Categorías</span>
        </a>

        <a routerLink="/admin/backup" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-amber-400">backup</span>
          <span>Backups de BD</span>
        </a>

        <div class="pt-6 my-4 border-t border-slate-800">
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Auditorías</h4>
        </div>

        <a routerLink="/admin/auditoria/usuarios" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-rose-400">shield_person</span>
          <span>Auditoría Usuarios</span>
        </a>

        <a routerLink="/admin/auditoria/productos" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-rose-400">manage_search</span>
          <span>Auditoría Productos</span>
        </a>

        <a routerLink="/admin/auditoria/categorias" routerLinkActive="bg-blue-600 text-white" 
           class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-rose-400">policy</span>
          <span>Auditoría Categorías</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .material-symbols-outlined {
      font-size: 20px;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
