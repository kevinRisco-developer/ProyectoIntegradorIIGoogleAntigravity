package com.pry.demo.modulo_inventario.controller;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_inventario.dto.ProductoCategoriaDTO;
import com.pry.demo.modulo_inventario.dto.ProductoVendidoDTO;
import com.pry.demo.modulo_inventario.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/producto")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<ProductoCategoriaDTO>> getAllProductos() {
        return ResponseEntity.ok(productoService.getProductosConCategoria());
    }

    @GetMapping("/raw")
    public ResponseEntity<List<Producto>> getAllProductosRaw() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<ProductoVendidoDTO>> getDestacados() {
        return ResponseEntity.ok(productoService.getProductosMasVendidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoById(@PathVariable Long id) {
        try {
            Producto p = productoService.getProductoById(id);
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable int id) {
        return ResponseEntity.ok(productoService.getProductosPorCategoria(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteProducto(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Producto deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.createProducto(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        try {
            // Retrieve current logged-in user email and resolve id_almacenero
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario user = usuarioRepository.findByEmail(email);
            Long idAlmacenero = (user != null) ? user.getId_usuario() : 1L; // Fallback to 1

            Producto updatedProduct = productoService.updateProducto(id, productoDetails, idAlmacenero);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating product: " + e.getMessage());
        }
    }
}
