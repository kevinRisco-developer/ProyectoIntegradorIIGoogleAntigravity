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

export interface Resena {
  id_resena?: number;
  id_usuario?: number;
  nombre_usuario?: string;
  id_producto: number;
  calificacion: number;
  comentario?: string;
  fecha?: string;
}

export interface ResenaResumen {
  promedio: number;
  total: number;
  resenas: Resena[];
}

export interface ResenaEstado {
  puede: boolean;
  yaReseno: boolean;
  miResena: Resena | null;
}
