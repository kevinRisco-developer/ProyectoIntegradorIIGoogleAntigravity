export interface Product {
  id_producto?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  id_categoria: number;
  imagen_url: string;
  estado: number;
  descuento?: number;
}

export interface ProductoDetalle extends Product {
  descuento: number;
  disponibilidad: string;
}

export interface Category {
  id_categoria?: number;
  nombre: string;
  descripcion?: string;
  estado?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
