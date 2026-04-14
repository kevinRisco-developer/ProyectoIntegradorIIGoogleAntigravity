export interface CartItem {
    id_producto: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen_url: string;
}

export interface Order {
    id_pedido?: number;
    id_usuario?: number;
    fecha?: string;
    total: number;
    estado?: string;
    nombreCompleto: string;
    direccionEnvio: string;
    telefono: string;
    metodoPago: string;
}

export interface OrderDetails {
    pedido: Order;
    detalles: {
        id_producto: number;
        nombre_producto: string;
        cantidad: number;
        precio: number;
    }[];
}
