import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = 'http://localhost:8080/admin/backup';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  generarBackup(): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar`, {}, { headers: this.getHeaders() });
  }

  listarBackups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }

  /** Historial de respaldos desde la tabla backup_log (HU-34). */
  getLog(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/log`, { headers: this.getHeaders() });
  }

  descargarBackup(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${fileName}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
