import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResenaResumen, ResenaEstado } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private apiUrl = 'http://localhost:8080/resena';

  // El jwtInterceptor global adjunta el token a las peticiones autenticadas.
  constructor(private http: HttpClient) {}

  /** Reseñas + promedio + total de un producto (público). */
  getResenasProducto(idProducto: number): Observable<ResenaResumen> {
    return this.http.get<ResenaResumen>(`${this.apiUrl}/producto/${idProducto}`);
  }

  /** Estado del cliente autenticado: puede reseñar / ya reseñó / su reseña. */
  getEstado(idProducto: number): Observable<ResenaEstado> {
    return this.http.get<ResenaEstado>(`${this.apiUrl}/estado/${idProducto}`);
  }

  /** Crea o actualiza la reseña del cliente. */
  crearResena(data: { id_producto: number; calificacion: number; comentario: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
