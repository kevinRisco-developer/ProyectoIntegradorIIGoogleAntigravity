import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 text-white font-sans p-6 text-center">
      <div class="mb-6 animate-bounce">
        <span class="material-symbols-outlined text-8xl text-rose-500">error</span>
      </div>
      <h1 class="text-6xl font-black text-blue-400 mb-4 tracking-tighter">404</h1>
      <h2 class="text-2xl font-bold mb-6 text-slate-200">Página No Encontrada</h2>
      <p class="text-slate-400 max-w-md mb-8 leading-relaxed">
        Lo sentimos, la página que buscas no existe o fue movida como parte de nuestra reestructuración arquitectónica.
      </p>
      <button routerLink="/" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">home</span>
        <span>Volver al Inicio</span>
      </button>
    </div>
  `
})
export class NotFoundComponent {}
