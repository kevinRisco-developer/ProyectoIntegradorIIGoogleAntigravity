import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem, Order } from '../models/order.model';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  // Mensajes para el usuario (p. ej. stock insuficiente). El shell muestra un toast.
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initCart();
  }

  private notify(msg: string) {
    this.messageSubject.next(msg);
    setTimeout(() => this.messageSubject.next(null), 4000);
  }

  private snapshot(): CartItem[] {
    return this.cartItems.value.map(i => ({ ...i }));
  }

  private initCart() {
    if (this.authService.isAuthenticated()) {
      this.loadCartFromApi();
    } else {
      const local = localStorage.getItem('cart');
      if (local) {
        this.cartItems.next(JSON.parse(local));
      }
    }
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  loadCartFromApi() {
    this.http.get<any[]>(`${this.apiUrl}/carrito`, { headers: this.getAuthHeaders() })
      .subscribe(dbItems => {
        // Aquí deberíamos mapear los datos del backend al modelo CartItem (que incluye nombre/precio)
        // Por simplicidad en este sprint, la API de carrito_detalle podría requerir enriquecimiento
        // o podemos confiar en que el frontend ya tiene los datos de productos
      });
  }

  addToCart(product: Product) {
    const prev = this.snapshot();
    const current = this.snapshot();
    const existing = current.find(i => i.id_producto === product.id_producto);

    if (existing) {
      existing.cantidad += 1;
    } else {
      current.push({
        id_producto: product.id_producto!,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        imagen_url: product.imagen_url
      });
    }

    this.updateState(current);

    if (this.authService.isAuthenticated()) {
      const dbItem = { id_producto: product.id_producto, cantidad: 1 };
      this.http.post(`${this.apiUrl}/carrito/add`, dbItem, { headers: this.getAuthHeaders() }).subscribe({
        error: (err) => {
          // El backend valida stock (HU-10/11): si rechaza, revertimos y avisamos.
          this.cartItems.next(prev);
          this.notify(err?.error?.message || 'No se pudo agregar el producto al carrito');
        }
      });
    }
  }

  updateQuantity(productId: number, change: number) {
    const prev = this.snapshot();
    const item = this.cartItems.value.find(i => i.id_producto === productId);
    if (!item) return;

    const newQty = item.cantidad + change;
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    // Optimista: aplicamos la nueva cantidad y la sincronizamos con el backend.
    const current = this.snapshot().map(i => i.id_producto === productId ? { ...i, cantidad: newQty } : i);
    this.updateState(current);

    if (this.authService.isAuthenticated()) {
      this.http.put(`${this.apiUrl}/carrito/item/${productId}`, { cantidad: newQty }, { headers: this.getAuthHeaders() })
        .subscribe({
          error: (err) => {
            this.cartItems.next(prev);
            this.notify(err?.error?.message || 'No se pudo actualizar la cantidad');
          }
        });
    }
  }

  removeFromCart(productId: number) {
    const current = this.cartItems.value.filter(i => i.id_producto !== productId);
    this.updateState(current);

    if (this.authService.isAuthenticated()) {
      this.http.delete(`${this.apiUrl}/carrito/item/${productId}`, { headers: this.getAuthHeaders() }).subscribe();
    }
  }

  private updateState(items: CartItem[]) {
    this.cartItems.next([...items]);
    if (!this.authService.isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  syncLocalStorageToDb() {
    const local = localStorage.getItem('cart');
    if (local && this.authService.isAuthenticated()) {
      const items = JSON.parse(local);
      this.http.post(`${this.apiUrl}/carrito/sync`, items, { headers: this.getAuthHeaders() })
        .subscribe(() => {
          localStorage.removeItem('cart');
          this.loadCartFromApi();
        });
    }
  }

  getTotal(): number {
    return this.cartItems.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((acc, item) => acc + item.cantidad, 0);
  }

  placeOrder(orderData: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedido`, orderData, { headers: this.getAuthHeaders() })
      .pipe(tap(() => {
        this.cartItems.next([]);
        localStorage.removeItem('cart');
      }));
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedido/${id}`, { headers: this.getAuthHeaders() });
  }

  getMisPedidos(page: number = 0, size: number = 6): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pedido/mis-pedidos?page=${page}&size=${size}`, { headers: this.getAuthHeaders() });
  }

  getPedidosPagados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedido/pagados`, { headers: this.getAuthHeaders() });
  }

  entregarPedido(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedido/${id}/entregar`, {}, { headers: this.getAuthHeaders() });
  }
}

