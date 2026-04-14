export interface Product {
  id_producto?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  id_categoria: number;
  imagen_url: string;
  estado: number;
}

export interface Category {
  id_categoria: number;
  nombre: string;
}
