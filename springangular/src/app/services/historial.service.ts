import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:8080/historial';

  constructor(private http: HttpClient) {}

  createHistorial(historial: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      ...historial,
      fecha: new Date().toISOString()
    });
  }
}
