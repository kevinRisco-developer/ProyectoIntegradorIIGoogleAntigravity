package com.pry.demo.modulo_ventas.controller;

import com.pry.demo.shared.model.Carrito_detalle;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_ventas.dto.CarritoItemDTO;
import com.pry.demo.modulo_ventas.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @GetMapping
    public ResponseEntity<?> getCarrito() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        List<Carrito_detalle> detalles = carritoService.getCarritoDetalles(user);
        return ResponseEntity.ok(detalles);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody Carrito_detalle item) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        carritoService.addItem(user, item);
        return ResponseEntity.ok(Map.of("message", "Producto añadido al carrito"));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncCarrito(@RequestBody List<Carrito_detalle> items) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        carritoService.syncCarrito(user, items);
        return ResponseEntity.ok(Map.of("message", "Carrito sincronizado exitosamente"));
    }

    @PutMapping("/item/{idProducto}")
    public ResponseEntity<?> updateItem(@PathVariable Long idProducto, @RequestBody CarritoItemDTO request) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        carritoService.updateItemCantidad(user, idProducto, request.getCantidad());
        return ResponseEntity.ok(Map.of("message", "Cantidad actualizada"));
    }

    @DeleteMapping("/item/{idProducto}")
    public ResponseEntity<?> removeItem(@PathVariable Long idProducto) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        carritoService.removeItem(user, idProducto);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado del carrito"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCarrito() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        carritoService.clearCarrito(user);
        return ResponseEntity.ok(Map.of("message", "Carrito limpiado"));
    }
}
