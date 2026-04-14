import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private mfaUrl = 'http://localhost:8080/mfa';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          if (res.role) {
            localStorage.setItem('role', res.role);
          }
        }
      })
    );
  }

  loginMfa(data: { email: string, code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/mfa`, data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          if (res.role) {
            localStorage.setItem('role', res.role);
          }
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getMfaStatus(): Observable<any> {
    return this.http.get(`${this.mfaUrl}/status`);
  }

  setupMfa(): Observable<any> {
    return this.http.post(`${this.mfaUrl}/setup`, {});
  }

  enableMfa(code: string): Observable<any> {
    return this.http.post(`${this.mfaUrl}/enable`, { code });
  }

  disableMfa(): Observable<any> {
    return this.http.post(`${this.mfaUrl}/disable`, {});
  }
}
