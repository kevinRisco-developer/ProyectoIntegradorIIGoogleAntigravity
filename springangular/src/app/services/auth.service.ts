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

  private mfaVerified = false;

  constructor(private http: HttpClient) {}

  setMfaVerified(v: boolean) {
    this.mfaVerified = v;
  }

  isMfaVerified(): boolean {
    return this.mfaVerified;
  }


  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // Solo persistimos la sesión cuando es un login definitivo (no cuando
        // requireMfa o mfaSetupRequired obligan a un paso adicional).
        if (res && res.token && !res.requireMfa && !res.mfaSetupRequired) {
          this.storeSession(res);
        }
      })
    );
  }

  loginMfa(data: { email: string, code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/mfa`, data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          this.storeSession(res);
        }
      })
    );
  }

  /**
   * Guarda tokens y datos de la sesión autenticada.
   */
  private storeSession(res: any) {
    localStorage.setItem('token', res.token);
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    if (res.role) {
      localStorage.setItem('role', res.role);
    }
    if (res.name) {
      localStorage.setItem('name', res.name);
    }
    if (res.id_usuario) {
      localStorage.setItem('userId', res.id_usuario.toString());
    }
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Renueva el access token de forma silenciosa usando el refresh token.
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
        }
      })
    );
  }

  /**
   * Almacena el token temporal usado durante el enrolamiento MFA obligatorio.
   */
  setSetupToken(token: string) {
    localStorage.setItem('token', token);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('name');
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

  // Roles internos (personal del sistema). El resto (CLIENTE/anónimo) usa la landing.
  static readonly INTERNAL_ROLES = ['ADMIN', 'VENDEDOR', 'INVENTARIO'];

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isVendedor(): boolean {
    return this.getRole() === 'VENDEDOR';
  }

  isInventario(): boolean {
    return this.getRole() === 'INVENTARIO';
  }

  isCliente(): boolean {
    return this.getRole() === 'CLIENTE';
  }

  isInternalRole(): boolean {
    const role = this.getRole();
    return role != null && AuthService.INTERNAL_ROLES.includes(role);
  }

  /**
   * Ruta de inicio según el rol tras autenticarse.
   * ADMIN → panel; INVENTARIO → productos; VENDEDOR → recojo; CLIENTE/anónimo → landing.
   */
  homeRouteForRole(): string {
    switch (this.getRole()) {
      case 'ADMIN': return '/admin';
      case 'INVENTARIO': return '/admin/productos';
      case 'VENDEDOR': return '/recojo-producto';
      default: return '/';
    }
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

  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}

