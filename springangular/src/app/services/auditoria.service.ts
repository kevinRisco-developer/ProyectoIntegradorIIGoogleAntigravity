import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getAuditoriaProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/producto`, { headers: this.getHeaders() });
  }

  getAuditoriaCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/categoria`, { headers: this.getHeaders() });
  }

  getAuditoriaUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAuditoriaUrl}/usuario`, { headers: this.getHeaders() });
  }
}
