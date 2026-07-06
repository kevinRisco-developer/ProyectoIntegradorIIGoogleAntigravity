package com.pry.demo.modulo_ventas.controller;

import com.pry.demo.modulo_ventas.service.PedidoService;
import com.pry.demo.shared.model.*;
import com.pry.demo.shared.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired private PedidoService pedidoService;
    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private Detalle_pedidoRepository detallePedidoRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    /**
     * POST /pedido
     * Crea un pedido para el usuario autenticado.
     * Estado inicial automático: EN_PROCESO → PAGADO (tras confirmar pago simulado).
     */
    @PostMapping
    public ResponseEntity<?> createPedido(@RequestBody Pedido pedidoRequest) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Pedido pedido = pedidoService.crearPedido(user, pedidoRequest);
        return ResponseEntity.ok(pedido);
    }

    /**
     * PUT /pedido/{id}/entregar
     * Transición manual PAGADO → ENTREGADO.
     * Requiere rol VENDEDOR (configurado en SecurityConfig).
     * Devuelve 400 si el pedido no está en estado PAGADO.
     */
    @PutMapping("/{id:[0-9]+}/entregar")
    public ResponseEntity<?> marcarEntregado(@PathVariable Long id) {
        Pedido pedido = pedidoService.marcarEntregado(id);
        return ResponseEntity.ok(pedido);
    }

    /**
     * GET /pedido/pagados
     * Devuelve todos los pedidos con estado PAGADO.
     * Requiere rol VENDEDOR (configurado en SecurityConfig).
     */
    @GetMapping("/pagados")
    public ResponseEntity<?> getPedidosPagados() {
        return ResponseEntity.ok(pedidoService.getPedidosPagados());
    }

    /**
     * GET /pedido/{id}
     * Obtiene el detalle de un pedido. Accesible por el propietario o por ADMIN/VENDEDOR.
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getPedidoDetails(@PathVariable Long id) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido no encontrado");
        }

        // Obtener el rol del usuario autenticado
        String authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        boolean isVendedorOrAdmin = authorities.contains("VENDEDOR") || authorities.contains("ADMIN");

        if (!pedido.getId_usuario().equals(user.getId_usuario()) && !isVendedorOrAdmin) {
            return ResponseEntity.status(403).body("Acceso denegado");
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

    /**
     * GET /pedido/mis-pedidos?page=0&size=10
     * Historial paginado del usuario autenticado, más recientes primero (HU-14).
     */
    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> getMisPedidos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Pageable pageable = PageRequest.of(page, size, Sort.by("id_pedido").descending());
        Page<Pedido> pedidos = pedidoRepository.findPedidosByUsuario(user.getId_usuario(), pageable);
        return ResponseEntity.ok(pedidos);
    }

    /**
     * GET /pedido
     * Devuelve todos los pedidos (solo ADMIN/VENDEDOR, configurado en SecurityConfig).
     */
    @GetMapping
    public ResponseEntity<?> getAllPedidos() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }
}
