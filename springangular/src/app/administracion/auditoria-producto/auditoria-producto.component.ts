import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService, AuditoriaFiltro } from '../../services/auditoria.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-auditoria-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>
      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-6 border-b border-slate-900 pb-6">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Auditoría de Productos</h1>
            <p class="text-slate-400 text-sm mt-1">Cambios de precio y stock por almacenero (HU-32).</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-emerald-500">manage_search</span>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Desde</label>
            <input type="date" [(ngModel)]="f.desde" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hasta</label>
            <input type="date" [(ngModel)]="f.hasta" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Responsable (ID almacenero)</label>
            <input type="number" [(ngModel)]="f.responsable" placeholder="ID" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Acción</label>
            <select [(ngModel)]="f.accion" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none">
              <option value="">Todas</option>
              <option value="MODIFICACION">Modificación</option>
              <option value="ELIMINACION">Eliminación</option>
              <option value="CREACION">Creación</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button (click)="filtrar()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">filter_alt</span> Filtrar
            </button>
            <button (click)="limpiar()" class="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
              <span class="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          </div>
        </div>

        <div *ngIf="loading()" class="p-10 text-center text-slate-500 flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-4xl animate-spin">sync</span><span>Cargando bitácora...</span>
        </div>
        <div *ngIf="!loading() && logs().length === 0" class="p-20 text-center text-slate-500 flex flex-col items-center gap-3 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
          <span class="material-symbols-outlined text-5xl">inventory_2</span><span>No hay registros que coincidan con el filtro.</span>
        </div>

        <div *ngIf="!loading() && logs().length > 0" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">ID Log</th>
                <th class="p-4">Producto</th>
                <th class="p-4">Acción</th>
                <th class="p-4">Precio (antes → después)</th>
                <th class="p-4">Stock (antes → después)</th>
                <th class="p-4">Responsable</th>
                <th class="p-4 pr-6 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              <tr *ngFor="let log of logs()" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ log.id_auditoria_producto }}</td>
                <td class="p-4 font-mono text-xs text-slate-300">Producto #{{ log.id_producto }}</td>
                <td class="p-4"><span [class]="accionClass(log.accion)" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border">{{ log.accion }}</span></td>
                <td class="p-4 text-xs text-slate-300">\${{ log.precio_pasado | number:'1.2-2' }} <span class="text-slate-600">→</span> <span class="text-emerald-400">\${{ log.precio_modificado | number:'1.2-2' }}</span></td>
                <td class="p-4 text-xs text-slate-300">
                  <span *ngIf="log.stock_anterior != null || log.stock_modificado != null">
                    {{ log.stock_anterior ?? '—' }} <span class="text-slate-600">→</span> <span class="text-amber-400">{{ log.stock_modificado ?? '—' }}</span>
                  </span>
                  <span *ngIf="log.stock_anterior == null && log.stock_modificado == null" class="text-slate-600">—</span>
                </td>
                <td class="p-4 font-mono text-xs text-slate-400">Almacenero #{{ log.id_almacenero || '—' }}</td>
                <td class="p-4 pr-6 text-right text-xs text-slate-500 font-mono">{{ log.fecha_modificacion | date:'dd/MM/yyyy HH:mm' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class AuditoriaProductoComponent implements OnInit {
  logs = signal<any[]>([]);
  loading = signal(true);
  f: AuditoriaFiltro = {};

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit() { this.filtrar(); }

  filtrar() {
    this.loading.set(true);
    this.auditoriaService.filtrarProductos(this.f).subscribe({
      next: (data) => { this.logs.set(data || []); this.loading.set(false); },
      error: () => { this.logs.set([]); this.loading.set(false); }
    });
  }

  limpiar() { this.f = {}; this.filtrar(); }

  accionClass(accion: string): string {
    switch ((accion || '').toUpperCase()) {
      case 'CREACION':     return 'bg-emerald-950/30 border-emerald-800 text-emerald-400';
      case 'MODIFICACION': return 'bg-blue-950/30 border-blue-800 text-blue-400';
      case 'ELIMINACION':  return 'bg-rose-950/30 border-rose-800 text-rose-400';
      default:             return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  }
}
