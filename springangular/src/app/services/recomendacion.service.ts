import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  private apiUrl = 'http://localhost:8080/recomendacion';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getSmartRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/smart`, { headers: this.getHeaders() });
  }

  sendOffers(): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-offers`, {}, { headers: this.getHeaders() });
  }

  triggerTestBatchEmail(): Observable<any> {
    return this.http.post(`${this.apiUrl}/test-batch-email`, {}, { headers: this.getHeaders() });
  }

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`, { headers: this.getHeaders() });
  }

  registrarInteraccion(idProducto: number, accion: string, permanencia: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/historial`,
      { id_producto: idProducto, accion, permanencia },
      { headers: this.getHeaders() }
    );
  }
}
