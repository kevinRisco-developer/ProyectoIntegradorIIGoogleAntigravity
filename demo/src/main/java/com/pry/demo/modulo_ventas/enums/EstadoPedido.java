package com.pry.demo.modulo_ventas.enums;

/**
 * Máquina de estados del Pedido.
 *
 * Transiciones permitidas:
 *   EN_PROCESO  →  PAGADO      (automático, al confirmar la pasarela de pago simulada)
 *   PAGADO      →  ENTREGADO   (manual, ejecutado por el Vendedor)
 *
 * Transiciones inválidas producen una excepción 400 Bad Request.
 */
public enum EstadoPedido {

    /** Estado inicial. Se asigna automáticamente al crear el pedido. */
    EN_PROCESO,

    /** Se asigna automáticamente cuando la pasarela de pago simulada confirma el pago. */
    PAGADO,

    /** Estado final. Lo asigna manualmente un usuario con rol VENDEDOR. */
    ENTREGADO
}
