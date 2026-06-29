package com.pry.demo.modulo_ventas.service;

import com.pry.demo.modulo_integraciones.service.EmailService;
import com.pry.demo.modulo_ventas.enums.EstadoPedido;
import com.pry.demo.shared.model.*;
import com.pry.demo.shared.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private Detalle_pedidoRepository detallePedidoRepository;
    @Autowired private CarritoRepository carritoRepository;
    @Autowired private Carrito_detalleRepository carritoDetalleRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private EmailService emailService;
    @Autowired private PagoService pagoService;

    /**
     * Crea un pedido para el usuario autenticado.
     * Flujo de estados automáticos:
     *   1. Se crea con estado EN_PROCESO.
     *   2. Si la pasarela de pago simulada confirma el pago → estado PAGADO.
     *
     * @param user           Usuario autenticado.
     * @param pedidoRequest  Datos del pedido (dirección, método de pago, etc.).
     * @return El pedido guardado con estado PAGADO.
     */
    @Transactional
    public Pedido crearPedido(Usuario user, Pedido pedidoRequest) {

        // Validar carrito
        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrito no encontrado");
        }

        List<Carrito_detalle> carritoItems = carritoDetalleRepository.findById_carrito(carrito.getId_carrito());
        if (carritoItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío");
        }

        // Crear el Pedido maestro con estado EN_PROCESO (estado inicial automático)
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setId_usuario(user.getId_usuario());
        nuevoPedido.setFecha(new Timestamp(System.currentTimeMillis()));
        nuevoPedido.setEstado(EstadoPedido.EN_PROCESO);
        nuevoPedido.setNombreCompleto(pedidoRequest.getNombreCompleto());
        nuevoPedido.setDireccionEnvio(pedidoRequest.getDireccionEnvio());
        nuevoPedido.setTelefono(pedidoRequest.getTelefono());
        nuevoPedido.setMetodoPago(pedidoRequest.getMetodoPago());

        // Calcular total y construir detalles
        double total = 0;
        List<Detalle_pedido> detallesParaGuardar = new ArrayList<>();
        List<Map<String, Object>> detallesParaEmail = new ArrayList<>();

        for (Carrito_detalle item : carritoItems) {
            Producto producto = productoRepository.findById(item.getId_producto())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Producto no encontrado: " + item.getId_producto()));

            if (producto.getStock() < item.getCantidad()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Stock insuficiente para: " + producto.getNombre());
            }

            // Descontar stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            // Construir detalle de pedido
            Detalle_pedido detalle = new Detalle_pedido();
            detalle.setId_producto(producto.getId_producto());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecio(producto.getPrecio());
            total += (producto.getPrecio() * item.getCantidad());
            detallesParaGuardar.add(detalle);

            // Construir ítem para el email
            Map<String, Object> emailItem = new HashMap<>();
            emailItem.put("nombre_producto", producto.getNombre());
            emailItem.put("cantidad", item.getCantidad());
            emailItem.put("precio", producto.getPrecio());
            detallesParaEmail.add(emailItem);
        }

        nuevoPedido.setTotal(total);
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // Persistir los detalles del pedido
        for (Detalle_pedido d : detallesParaGuardar) {
            d.setId_pedido(pedidoGuardado.getId_pedido());
            detallePedidoRepository.save(d);
        }

        // Confirmar pago simulado → transición automática EN_PROCESO → PAGADO
        pagoService.procesarPagoSimulado(pedidoGuardado.getId_pedido(), total, pedidoRequest.getMetodoPago());
        pedidoGuardado.setEstado(EstadoPedido.PAGADO);
        pedidoRepository.save(pedidoGuardado);

        // Limpiar el carrito del usuario
        carritoDetalleRepository.deleteAll(carritoItems);

        // Enviar ticket de compra por email (no crítico: no bloquea si falla)
        try {
            emailService.sendOrderTicket(user, pedidoGuardado, detallesParaEmail);
        } catch (Exception e) {
            System.err.println("[WARN] No se pudo enviar el email de confirmación: " + e.getMessage());
        }

        return pedidoGuardado;
    }

    /**
     * Transición manual: PAGADO → ENTREGADO.
     * Solo puede ejecutarla un usuario con rol VENDEDOR.
     * Si el pedido está en un estado diferente a PAGADO, se lanza un error 400.
     *
     * @param idPedido ID del pedido a marcar como entregado.
     * @return El pedido actualizado con estado ENTREGADO.
     */
    @Transactional
    public Pedido marcarEntregado(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pedido no encontrado con id: " + idPedido));

        // Validar transición: solo se puede pasar a ENTREGADO desde PAGADO
        if (pedido.getEstado() != EstadoPedido.PAGADO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transición inválida: el pedido debe estar en estado PAGADO para marcarse como ENTREGADO. " +
                    "Estado actual: " + pedido.getEstado());
        }

        pedido.setEstado(EstadoPedido.ENTREGADO);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> getPedidosPagados() {
        return pedidoRepository.findByEstado(EstadoPedido.PAGADO);
    }
}
