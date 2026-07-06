import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Acciones de comportamiento capturadas por el motor de recomendaciones. */
export type AccionHistorial = 'VIEW' | 'CLICK' | 'ADD_CART';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:8080/api/historial';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Registra un evento de comportamiento (VIEW >=5s, CLICK, ADD_CART).
   * Silencioso: los errores no interrumpen la navegación del usuario.
   */
  registrarEvento(idProducto: number, accion: AccionHistorial, permanencia = 0): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { id_producto: idProducto, accion, permanencia },
      { headers: this.getHeaders() }
    );
  }

  /** Historial de interacciones del usuario autenticado. */
  getMisInteracciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
