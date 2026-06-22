package com.pry.demo.modulo_ventas.controller;

import com.pry.demo.shared.model.*;
import com.pry.demo.shared.repository.*;
import com.pry.demo.modulo_integraciones.service.EmailService;
import com.pry.demo.modulo_ventas.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private Detalle_pedidoRepository detallePedidoRepository;
    @Autowired private CarritoRepository carritoRepository;
    @Autowired private Carrito_detalleRepository carritoDetalleRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EmailService emailService;
    @Autowired private PagoService pagoService;

    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createPedido(@RequestBody Pedido pedidoRequest) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito == null) return ResponseEntity.badRequest().body("Carrito no encontrado");

        List<Carrito_detalle> carritoItems = carritoDetalleRepository.findById_carrito(carrito.getId_carrito());
        if (carritoItems.isEmpty()) return ResponseEntity.badRequest().body("El carrito está vacío");

        // Crear el Pedido Maestro
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setId_usuario(user.getId_usuario());
        nuevoPedido.setFecha(new Timestamp(System.currentTimeMillis()));
        nuevoPedido.setEstado("PENDIENTE");
        nuevoPedido.setNombreCompleto(pedidoRequest.getNombreCompleto());
        nuevoPedido.setDireccionEnvio(pedidoRequest.getDireccionEnvio());
        nuevoPedido.setTelefono(pedidoRequest.getTelefono());
        nuevoPedido.setMetodoPago(pedidoRequest.getMetodoPago());

        double total = 0;
        final List<Detalle_pedido> detallesParaGuardar = new ArrayList<>();
        final List<Map<String, Object>> detallesParaEmail = new ArrayList<>();

        for (Carrito_detalle item : carritoItems) {
            Producto producto = productoRepository.findById(item.getId_producto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getId_producto()));

            if (producto.getStock() < item.getCantidad()) {
                return ResponseEntity.badRequest().body("Stock insuficiente para: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            Detalle_pedido detalle = new Detalle_pedido();
            detalle.setId_producto(producto.getId_producto());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecio(producto.getPrecio());
            total += (producto.getPrecio() * item.getCantidad());
            detallesParaGuardar.add(detalle);

            Map<String, Object> emailItem = new HashMap<>();
            emailItem.put("nombre_producto", producto.getNombre());
            emailItem.put("cantidad", item.getCantidad());
            emailItem.put("precio", producto.getPrecio());
            detallesParaEmail.add(emailItem);
        }

        nuevoPedido.setTotal(total);
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // Guardar Detalles
        for (Detalle_pedido d : detallesParaGuardar) {
            d.setId_pedido(pedidoGuardado.getId_pedido());
            detallePedidoRepository.save(d);
        }

        // Procesar pago simulado
        pagoService.procesarPagoSimulado(pedidoGuardado.getId_pedido(), total, pedidoRequest.getMetodoPago());

        // Actualizar estado del pedido a COMPLETADO
        pedidoGuardado.setEstado("COMPLETADO");
        pedidoRepository.save(pedidoGuardado);

        // Limpiar Carrito
        carritoDetalleRepository.deleteAll(carritoItems);

        // Enviar Email con ticket de compra
        try {
            emailService.sendOrderTicket(user, pedidoGuardado, detallesParaEmail);
        } catch (Exception e) {
            System.err.println("Error enviando email de confirmación: " + e.getMessage());
        }

        return ResponseEntity.ok(pedidoGuardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoDetails(@PathVariable Long id) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null || !pedido.getId_usuario().equals(user.getId_usuario())) {
            return ResponseEntity.status(404).body("Pedido no encontrado");
        }

        List<Detalle_pedido> detalles = detallePedidoRepository.findById_pedido(pedido.getId_pedido());

        List<Map<String, Object>> detallesEnriquecidos = new ArrayList<>();
        for (Detalle_pedido d : detalles) {
            Map<String, Object> map = new HashMap<>();
            map.put("id_producto", d.getId_producto());
            map.put("cantidad", d.getCantidad());
            map.put("precio", d.getPrecio());
            Producto p = productoRepository.findById(d.getId_producto()).orElse(null);
            map.put("nombre_producto", p != null ? p.getNombre() : "Producto Desconocido");
            detallesEnriquecidos.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("pedido", pedido);
        response.put("detalles", detallesEnriquecidos);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> getMisPedidos() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        List<Pedido> pedidos = pedidoRepository.findAll().stream()
                .filter(p -> p.getId_usuario().equals(user.getId_usuario()))
                .toList();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping
    public ResponseEntity<?> getAllPedidos() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }
}
