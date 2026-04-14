package com.pry.demo.controller;

import com.pry.demo.model.Carrito;
import com.pry.demo.model.Carrito_detalle;
import com.pry.demo.model.Usuario;
import com.pry.demo.repository.CarritoRepository;
import com.pry.demo.repository.Carrito_detalleRepository;
import com.pry.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private Carrito_detalleRepository detalleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    private Carrito getOrCreateCarrito(Usuario user) {
        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito == null) {
            carrito = new Carrito();
            carrito.setId_usuario(user.getId_usuario());
            carrito.setFecha_creacion(new Timestamp(System.currentTimeMillis()));
            carrito = carritoRepository.save(carrito);
        }
        return carrito;
    }

    @GetMapping
    public ResponseEntity<?> getCarrito() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = getOrCreateCarrito(user);
        List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
        return ResponseEntity.ok(detalles);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody Carrito_detalle item) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = getOrCreateCarrito(user);
        
        // Buscar si ya existe el producto en el carrito
        List<Carrito_detalle> actuales = detalleRepository.findById_carrito(carrito.getId_carrito());
        Optional<Carrito_detalle> existente = actuales.stream()
                .filter(d -> d.getId_producto().equals(item.getId_producto()))
                .findFirst();

        if (existente.isPresent()) {
            Carrito_detalle d = existente.get();
            d.setCantidad(d.getCantidad() + item.getCantidad());
            detalleRepository.save(d);
        } else {
            item.setId_carrito(carrito.getId_carrito());
            detalleRepository.save(item);
        }

        return ResponseEntity.ok(Map.of("message", "Producto añadido al carrito"));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncCarrito(@RequestBody List<Carrito_detalle> items) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = getOrCreateCarrito(user);
        
        for (Carrito_detalle item : items) {
            List<Carrito_detalle> actuales = detalleRepository.findById_carrito(carrito.getId_carrito());
            Optional<Carrito_detalle> existente = actuales.stream()
                    .filter(d -> d.getId_producto().equals(item.getId_producto()))
                    .findFirst();

            if (existente.isPresent()) {
                Carrito_detalle d = existente.get();
                d.setCantidad(d.getCantidad() + item.getCantidad());
                detalleRepository.save(d);
            } else {
                item.setId_carrito(carrito.getId_carrito());
                item.setId_detalle(null); // Asegurar que sea nuevo
                detalleRepository.save(item);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Carrito sincronizado exitosamente"));
    }

    @DeleteMapping("/item/{idProducto}")
    public ResponseEntity<?> removeItem(@PathVariable Long idProducto) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito != null) {
            List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
            detalles.stream()
                    .filter(d -> d.getId_producto().equals(idProducto))
                    .findFirst()
                    .ifPresent(d -> detalleRepository.delete(d));
        }

        return ResponseEntity.ok(Map.of("message", "Producto eliminado del carrito"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCarrito() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito != null) {
            List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
            detalleRepository.deleteAll(detalles);
        }

        return ResponseEntity.ok(Map.of("message", "Carrito limpiado"));
    }
}
