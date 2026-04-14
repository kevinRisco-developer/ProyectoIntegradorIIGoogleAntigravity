import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Métodos Públicos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/producto`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categoria`);
  }

  getRecommendations(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/recomendacion/smart`, { headers: this.getAuthHeaders() });
  }

  // Métodos Protegidos (Solo Admin)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/producto`, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/producto/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/producto/${id}`, { headers: this.getAuthHeaders() });
  }
}
