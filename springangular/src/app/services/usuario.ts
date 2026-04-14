import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  private apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get(this.apiUrl);
  }
}
