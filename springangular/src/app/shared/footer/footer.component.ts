import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-slate-950 border-t border-slate-900 w-full font-sans text-sm text-slate-400">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 w-full container mx-auto">
        <div>
          <div class="font-extrabold text-blue-400 text-xl mb-6">ImportSmart</div>
          <p class="text-slate-500 leading-relaxed mb-6">
            Estructurando el futuro de la logística global a través de diseño inteligente y análisis cognitivo de datos.
          </p>
          <div class="flex gap-4">
            <span class="material-symbols-outlined text-blue-400 cursor-pointer hover:scale-110 transition-transform">public</span>
            <span class="material-symbols-outlined text-blue-400 cursor-pointer hover:scale-110 transition-transform">hub</span>
            <span class="material-symbols-outlined text-blue-400 cursor-pointer hover:scale-110 transition-transform">share</span>
          </div>
        </div>
        <div>
          <h6 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Soluciones</h6>
          <ul class="space-y-4 text-xs">
            <li><a class="hover:text-blue-400 transition-colors" href="#">Sourcing Global</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Logística con IA</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Acceso Integrado a Catálogos</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Reportes Inteligentes</a></li>
          </ul>
        </div>
        <div>
          <h6 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Soporte y Legal</h6>
          <ul class="space-y-4 text-xs">
            <li><a class="hover:text-blue-400 transition-colors" href="#">Política de Privacidad</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Términos del Servicio</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Documentación API</a></li>
            <li><a class="hover:text-blue-400 transition-colors" href="#">Contáctanos</a></li>
          </ul>
        </div>
        <div>
          <h6 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Suscripción Informativa</h6>
          <p class="text-slate-500 mb-4 text-xs">Recibe las últimas novedades logísticas cada semana.</p>
          <div class="flex">
            <input class="bg-slate-900 border border-slate-800 rounded-l-lg p-2.5 text-xs w-full text-white focus:outline-none focus:border-blue-500" placeholder="Correo Electrónico" type="email"/>
            <button class="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-colors"><span class="material-symbols-outlined text-sm">send</span></button>
          </div>
        </div>
      </div>
      <div class="border-t border-slate-900 py-8 px-12 text-center text-slate-500 text-xs">
        © 2026 ImportSmart. Sistema Arquitectónico Cognitivo de Importaciones. Todos los derechos reservados.
      </div>
    </footer>
  `
})
export class FooterComponent {}
