import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaService } from '../../services/auditoria.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-auditoria-producto',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-8 border-b border-slate-900 pb-6">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Auditoría de Productos</h1>
            <p class="text-slate-400 text-sm mt-1">Bitácora de inserciones, ediciones de stock y eliminación de productos.</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-rose-500">manage_search</span>
        </div>

        <div *ngIf="loading" class="p-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <span class="material-symbols-outlined text-4xl animate-spin">sync</span>
          <span>Cargando bitácora de productos...</span>
        </div>

        <div *ngIf="!loading && logs.length === 0" class="p-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <span class="material-symbols-outlined text-5xl">inventory_2</span>
          <span>No hay registros de auditoría de productos disponibles.</span>
        </div>

        <div *ngIf="!loading && logs.length > 0" class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">ID Log</th>
                <th class="p-4">ID Producto</th>
                <th class="p-4">Acción</th>
                <th class="p-4">ID Almacenero</th>
                <th class="p-4">Detalle / Query</th>
                <th class="p-4 pr-6 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let log of logs" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ log.id_auditoria }}</td>
                <td class="p-4 font-mono text-xs text-slate-300">#{{ log.id_producto }}</td>
                <td class="p-4">
                  <span [class]="getAccionClass(log.accion)" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border">
                    {{ log.accion }}
                  </span>
                </td>
                <td class="p-4 font-mono text-xs text-slate-400">#{{ log.id_almacenero || 'Sistema' }}</td>
                <td class="p-4 text-xs font-light text-slate-350 max-w-xs truncate" [title]="log.detalles">{{ log.detalles || 'Sin detalles' }}</td>
                <td class="p-4 pr-6 text-right text-xs text-slate-500 font-mono">{{ log.fecha | date:'dd/MM/yyyy HH:mm:ss' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class AuditoriaProductoComponent implements OnInit {
  logs: any[] = [];
  loading = true;

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit() {
    this.auditoriaService.getAuditoriaProductos().subscribe({
      next: (data) => {
        this.logs = data.sort((a, b) => b.id_auditoria - a.id_auditoria);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAccionClass(accion: string): string {
    switch (accion?.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400';
      case 'UPDATE':
        return 'bg-blue-950/20 border-blue-900/40 text-blue-400';
      case 'DELETE':
        return 'bg-rose-950/20 border-rose-900/40 text-rose-400';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  }
}
