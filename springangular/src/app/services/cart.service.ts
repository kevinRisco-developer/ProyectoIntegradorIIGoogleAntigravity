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

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initCart();
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
    let current = this.cartItems.value;
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
      this.http.post(`${this.apiUrl}/carrito/add`, dbItem, { headers: this.getAuthHeaders() }).subscribe();
    }
  }

  updateQuantity(productId: number, change: number) {
    let current = this.cartItems.value;
    const item = current.find(i => i.id_producto === productId);
    if (item) {
      item.cantidad += change;
      if (item.cantidad <= 0) {
        current = current.filter(i => i.id_producto !== productId);
      }
      this.updateState(current);
      
      // Sincronizar ajuste con DB si está logueado
      if (this.authService.isAuthenticated()) {
         // Opcional: Implementar endpoint de actualización exacta o simplemente sync
      }
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
}
