import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupService } from '../../services/backup.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-backup-admin',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans flex">
      <app-sidebar></app-sidebar>

      <main class="flex-1 p-10">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-blue-400">Copias de Seguridad (Backups)</h1>
            <p class="text-slate-400 text-sm mt-1">Genera copias físicas de la base de datos MySQL y descarga los archivos SQL del servidor.</p>
          </div>
          <button (click)="generarBackup()" [disabled]="generating"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 disabled:opacity-50">
            <span class="material-symbols-outlined text-sm animate-spin" *ngIf="generating">sync</span>
            <span class="material-symbols-outlined text-sm" *ngIf="!generating">backup</span>
            <span>{{ generating ? 'Generando...' : 'Generar y descargar backup' }}</span>
          </button>
        </div>

        <!-- Alertas -->
        <div *ngIf="alertMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-8 flex items-center gap-2">
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span>{{ alertMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="bg-rose-950/40 border border-rose-800 text-rose-350 p-4 rounded-xl text-sm font-semibold mb-8 flex items-center gap-2">
          <span class="material-symbols-outlined text-base">error</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Lista de Backups -->
        <div class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg">
          <div class="p-6 border-b border-slate-850 bg-slate-950/40 flex justify-between items-center">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Archivos SQL Disponibles</h3>
            <span class="text-xs text-slate-500 font-mono">Total: {{ backups.length }} archivos</span>
          </div>

          <div *ngIf="loading" class="p-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <span class="material-symbols-outlined text-4xl animate-spin">sync</span>
            <span>Cargando lista de backups...</span>
          </div>

          <div *ngIf="!loading && backups.length === 0" class="p-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3 border-t border-slate-850/40">
            <span class="material-symbols-outlined text-5xl">folder_off</span>
            <span>No se han encontrado copias de seguridad en el servidor.</span>
          </div>

          <table *ngIf="!loading && backups.length > 0" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-450">
                <th class="p-4 pl-6">Nombre de Archivo</th>
                <th class="p-4">Tipo</th>
                <th class="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let file of backups" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-slate-200">{{ file }}</td>
                <td class="p-4">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-900/40 uppercase">SQL Dump</span>
                </td>
                <td class="p-4 pr-6 text-right">
                  <button (click)="descargarBackup(file)" 
                          class="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-400 font-semibold py-1.5 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-all inline-flex ml-auto">
                    <span class="material-symbols-outlined text-xs">download</span>
                    <span>Descargar SQL</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Historial de respaldos (backup_log) -->
        <div class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-lg mt-8">
          <div class="p-6 border-b border-slate-850 bg-slate-950/40 flex justify-between items-center">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Historial de respaldos (log)</h3>
            <span class="text-xs text-slate-500 font-mono">Total: {{ logs.length }} registros</span>
          </div>

          <div *ngIf="logs.length === 0" class="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <span class="material-symbols-outlined text-4xl">history</span>
            <span>Aún no hay respaldos registrados.</span>
          </div>

          <table *ngIf="logs.length > 0" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th class="p-4 pl-6">Archivo</th>
                <th class="p-4">Origen</th>
                <th class="p-4">Estado</th>
                <th class="p-4">Tamaño</th>
                <th class="p-4">Admin</th>
                <th class="p-4 pr-6 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850 text-sm">
              <tr *ngFor="let l of logs" class="hover:bg-slate-800/20 transition-colors">
                <td class="p-4 pl-6 font-mono text-xs text-slate-300">{{ l.archivo || '—' }}</td>
                <td class="p-4">
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                        [class]="l.tipo === 'CRON' ? 'bg-indigo-950/30 border-indigo-800 text-indigo-400' : 'bg-blue-950/30 border-blue-800 text-blue-400'">{{ l.tipo }}</span>
                </td>
                <td class="p-4">
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                        [class]="l.estado === 'OK' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'"
                        [title]="l.mensaje || ''">{{ l.estado }}</span>
                </td>
                <td class="p-4 text-xs text-slate-400 font-mono">{{ formatBytes(l.tamano_bytes) }}</td>
                <td class="p-4 text-xs text-slate-400 font-mono">{{ l.id_admin ? ('#' + l.id_admin) : 'Sistema' }}</td>
                <td class="p-4 pr-6 text-right text-xs text-slate-500 font-mono">{{ l.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `
})
export class BackupComponent implements OnInit {
  backups: string[] = [];
  logs: any[] = [];
  loading = true;
  generating = false;
  alertMessage = '';
  errorMessage = '';

  constructor(private backupService: BackupService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBackups();
    this.loadLog();
  }

  loadLog() {
    this.backupService.getLog().subscribe({
      next: (data) => { this.logs = data || []; this.cdr.detectChanges(); },
      error: () => { this.logs = []; }
    });
  }

  formatBytes(bytes: number | null): string {
    if (!bytes || bytes <= 0) return '—';
    const u = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + u[i];
  }

  loadBackups() {
    this.loading = true;
    this.backupService.listarBackups().subscribe({
      next: (res) => {
        this.backups = res.backups || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'No se pudo listar los backups del servidor.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generarBackup() {
    this.generating = true;
    this.alertMessage = '';
    this.errorMessage = '';

    this.backupService.generarBackup().subscribe({
      next: (res) => {
        this.generating = false;
        this.alertMessage = `Backup generado: ${res.archivo}. Iniciando descarga...`;
        this.loadBackups();
        this.loadLog();
        // Descarga automática del archivo recién creado.
        if (res.archivo) {
          this.descargarBackup(res.archivo);
        }
        setTimeout(() => this.alertMessage = '', 6000);
      },
      error: (err) => {
        this.generating = false;
        this.errorMessage = 'Error de servidor: ' + (err.error?.error || err.message);
        this.loadLog();
        this.cdr.detectChanges();
      }
    });
  }

  descargarBackup(fileName: string) {
    this.backupService.descargarBackup(fileName).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('No se pudo descargar el archivo.');
      }
    });
  }
}
