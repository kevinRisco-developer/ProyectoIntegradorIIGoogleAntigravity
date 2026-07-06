import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditoriaFiltro {
  desde?: string;        // yyyy-MM-dd
  hasta?: string;        // yyyy-MM-dd
  responsable?: number;  // id_admin / id_almacenero
  accion?: string;       // MODIFICACION / ELIMINACION / CREACION
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private baseAuditoriaUrl = 'http://localhost:8080/admin/auditoria';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private buildParams(f?: AuditoriaFiltro): HttpParams {
    let params = new HttpParams();
    if (f?.desde) params = params.set('desde', f.desde);
    if (f?.hasta) params = params.set('hasta', f.hasta);
    if (f?.responsable != null) params = params.set('responsable', String(f.responsable));
    if (f?.accion) params = params.set('accion', f.accion);
    return params;
  }

  // Listado completo (compatibilidad)
  getAuditoriaProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/producto`, { headers: this.getHeaders() });
  }
  getAuditoriaCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/categoria`, { headers: this.getHeaders() });
  }
  getAuditoriaUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/usuario`, { headers: this.getHeaders() });
  }

  // Consultas filtradas (HU-31/32/33)
  filtrarUsuarios(f?: AuditoriaFiltro): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/usuario/filtrar`, { headers: this.getHeaders(), params: this.buildParams(f) });
  }
  filtrarProductos(f?: AuditoriaFiltro): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/producto/filtrar`, { headers: this.getHeaders(), params: this.buildParams(f) });
  }
  filtrarCategorias(f?: AuditoriaFiltro): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/categoria/filtrar`, { headers: this.getHeaders(), params: this.buildParams(f) });
  }
}
