import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecomendacionService } from '../../services/recomendacion.service';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-900 pb-8">
          <div>
            <h1 class="text-4xl font-black text-blue-400 tracking-tight">Recomendaciones Inteligentes</h1>
            <p class="text-slate-400 text-sm mt-2 font-light">Sugerencias personalizadas basadas en tu historial de navegación e interacciones.</p>
          </div>
          <div class="flex gap-4">
            <button (click)="enviarOfertasPorEmail()" [disabled]="sendingEmail"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 text-sm disabled:opacity-50">
              <span class="material-symbols-outlined text-sm animate-spin" *ngIf="sendingEmail">sync</span>
              <span class="material-symbols-outlined text-sm" *ngIf="!sendingEmail">mail</span>
              <span>Enviar Ofertas por Email</span>
            </button>
          </div>
        </div>

        <!-- Alertas -->
        <div *ngIf="alertMessage" class="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-8 flex items-center gap-2">
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span>{{ alertMessage }}</span>
        </div>

        <!-- Cuadrícula de Recomendaciones -->
        <h2 class="text-xl font-bold mb-6 text-slate-200">Recomendaciones para ti</h2>
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div *ngFor="let n of [1,2,3]" class="bg-slate-900 border border-slate-800 animate-pulse h-96 rounded-3xl"></div>
        </div>

        <div *ngIf="!loading && recommendations.length === 0" class="text-center py-16 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl mb-16">
          <span class="material-symbols-outlined text-5xl text-slate-600 mb-4">analytics</span>
          <h3 class="text-lg font-bold text-slate-400">No hay suficientes interacciones para generar recomendaciones.</h3>
          <p class="text-xs text-slate-500 mt-2">Navega por más productos para que nuestro modelo aprenda tus gustos.</p>
        </div>

        <div *ngIf="!loading && recommendations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div *ngFor="let product of recommendations" 
               class="group bg-slate-900 border border-slate-850 rounded-3xl hover:border-blue-900/40 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div class="relative h-56 bg-slate-950 cursor-pointer" [routerLink]="['/producto', product.id_producto]">
              <img [src]="product.imagen_url" [alt]="product.nombre" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full shadow-md">
                <span class="text-blue-400 font-black text-sm">\${{ product.precio | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors cursor-pointer" [routerLink]="['/producto', product.id_producto]">{{ product.nombre }}</h3>
                <p class="text-slate-400 text-xs font-light line-clamp-3 mb-6">{{ product.descripcion }}</p>
              </div>
              <button [routerLink]="['/producto', product.id_producto]" 
                      class="w-full bg-slate-950 border border-slate-800 hover:border-blue-600/40 text-blue-400 rounded-xl py-3 text-xs font-bold transition-all text-center block">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Historial de Interacciones -->
        <div class="border-t border-slate-900 pt-12">
          <h2 class="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-slate-400">history</span>
            <span>Historial Reciente de Interacciones</span>
          </h2>

          <div *ngIf="loadingHistorial" class="space-y-4">
            <div *ngFor="let n of [1,2]" class="bg-slate-900 border border-slate-800 animate-pulse h-16 rounded-xl"></div>
          </div>

          <div *ngIf="!loadingHistorial && historial.length === 0" class="text-slate-500 text-sm font-light">
            No tienes interacciones registradas recientemente.
          </div>

          <div *ngIf="!loadingHistorial && historial.length > 0" class="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th class="p-4 pl-6">ID Producto</th>
                  <th class="p-4">Acción</th>
                  <th class="p-4">Permanencia (seg)</th>
                  <th class="p-4 pr-6 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-850 text-sm">
                <tr *ngFor="let h of historial" class="hover:bg-slate-800/40 transition-colors">
                  <td class="p-4 pl-6 font-mono text-xs text-blue-400">#{{ h.id_producto }}</td>
                  <td class="p-4 font-semibold">
                    <span [class]="getAccionClass(h.accion)" class="px-2 py-0.5 rounded text-xs border uppercase">
                      {{ h.accion }}
                    </span>
                  </td>
                  <td class="p-4 font-mono text-xs">{{ h.permanencia }}s</td>
                  <td class="p-4 pr-6 text-right text-xs text-slate-500">{{ h.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecomendacionesComponent implements OnInit {
  recommendations: Product[] = [];
  historial: any[] = [];
  loading = true;
  loadingHistorial = true;
  sendingEmail = false;
  alertMessage = '';

  constructor(private recomendacionService: RecomendacionService) {}

  ngOnInit() {
    this.loadRecommendations();
    this.loadHistorial();
  }

  loadRecommendations() {
    this.recomendacionService.getSmartRecommendations().subscribe({
      next: (data) => {
        this.recommendations = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadHistorial() {
    this.recomendacionService.getHistorial().subscribe({
      next: (data) => {
        this.historial = data.sort((a, b) => b.id_historial - a.id_historial).slice(0, 10);
        this.loadingHistorial = false;
      },
      error: () => {
        this.loadingHistorial = false;
      }
    });
  }

  enviarOfertasPorEmail() {
    this.sendingEmail = true;
    this.recomendacionService.sendOffers().subscribe({
      next: (res) => {
        this.sendingEmail = false;
        this.alertMessage = 'Se han enviado tus recomendaciones personalizadas por email.';
        setTimeout(() => this.alertMessage = '', 4000);
      },
      error: () => {
        this.sendingEmail = false;
      }
    });
  }

  getAccionClass(accion: string): string {
    switch (accion?.toUpperCase()) {
      case 'VIEW':
        return 'bg-blue-950/20 border-blue-900/40 text-blue-400';
      case 'STAY':
        return 'bg-amber-950/20 border-amber-900/40 text-amber-400';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  }
}
