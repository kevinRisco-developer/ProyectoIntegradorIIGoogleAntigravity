import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductoDetalle, Category, PagedResponse } from '../models/product.model';

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

  // ============================================================
  // Métodos PÚBLICOS — sin autenticación
  // ============================================================

  /** Listado público paginado de productos activos. HU-05 */
  getPublicProducts(page: number = 0, size: number = 12): Observable<PagedResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Product>>(`${this.apiUrl}/producto/public`, { params });
  }

  /** Búsqueda FULLTEXT paginada. HU-07 */
  searchPublicProducts(query: string, page: number = 0, size: number = 12): Observable<PagedResponse<Product>> {
    const params = new HttpParams().set('query', query).set('page', page).set('size', size);
    return this.http.get<PagedResponse<Product>>(`${this.apiUrl}/producto/public/search`, { params });
  }

  /** Filtro por categoría paginado. HU-08 */
  getPublicProductsByCategory(catId: number, page: number = 0, size: number = 12): Observable<PagedResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Product>>(`${this.apiUrl}/producto/public/categoria/${catId}`, { params });
  }

  /** Detalle de un producto con disponibilidad. HU-09 */
  getPublicProductDetail(id: number): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.apiUrl}/producto/public/${id}`);
  }

  /** Lista categorías activas para el catálogo del cliente. HU-06 */
  getPublicCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categoria/public`);
  }

  getFeaturedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto/destacados`);
  }

  // ============================================================
  // Métodos para INVENTARIO (con autenticación)
  // ============================================================

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/producto`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/producto/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categoria`);
  }

  getRecommendations(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/recomendacion/smart`, { headers: this.getAuthHeaders() });
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/producto`, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/producto/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/producto/${id}`, { headers: this.getAuthHeaders() });
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categoria`, category, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categoria/${id}`, category, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categoria/${id}`, { headers: this.getAuthHeaders() });
  }
}
