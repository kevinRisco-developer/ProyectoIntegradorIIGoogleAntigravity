package com.pry.demo.modulo_inventario.controller;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_inventario.dto.ProductoCategoriaDTO;
import com.pry.demo.modulo_inventario.dto.ProductoDetalleDTO;
import com.pry.demo.modulo_inventario.dto.ProductoVendidoDTO;
import com.pry.demo.modulo_inventario.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    // =============================================================
    // Endpoints PÚBLICOS — accesibles por CLIENTE sin autenticación
    // =============================================================

    /**
     * Listado público paginado de productos activos.
     * HU-05: Ver catálogo de productos
     */
    @GetMapping("/public")
    public ResponseEntity<Page<Producto>> getProductosPublic(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.getProductosActivos(pageable));
    }

    /**
     * Búsqueda de productos por nombre usando índice FULLTEXT.
     * HU-07: Buscar productos por nombre
     */
    @GetMapping("/public/search")
    public ResponseEntity<Page<Producto>> searchProductos(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.searchProductos(query, pageable));
    }

    /**
     * Filtro de productos por categoría.
     * HU-08: Filtrar productos por categoría
     */
    @GetMapping("/public/categoria/{id}")
    public ResponseEntity<Page<Producto>> getProductosPorCategoriaPublic(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.getProductosPorCategoriaPublic(id, pageable));
    }

    /**
     * Detalle de un producto para el cliente.
     * HU-09: Ver detalle de producto con stock y disponibilidad
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getProductoDetallePublic(@PathVariable Long id) {
        try {
            ProductoDetalleDTO dto = productoService.getProductoDetalle(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =============================================================
    // Endpoints de administración — solo INVENTARIO/ADMIN
    // =============================================================

    /** Lista todos los productos con categoría (via procedure). */
    @GetMapping
    public ResponseEntity<List<ProductoCategoriaDTO>> getAllProductos() {
        return ResponseEntity.ok(productoService.getProductosConCategoria());
    }

    /** Lista todos los productos sin enrichment. */
    @GetMapping("/raw")
    public ResponseEntity<List<Producto>> getAllProductosRaw() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    /** Top productos más vendidos. */
    @GetMapping("/destacados")
    public ResponseEntity<List<ProductoVendidoDTO>> getDestacados() {
        return ResponseEntity.ok(productoService.getProductosMasVendidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productoService.getProductoById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable int id) {
        return ResponseEntity.ok(productoService.getProductosPorCategoria(id));
    }

    /**
     * Baja lógica: cambia estado a 0 en lugar de borrar físicamente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        try {
            Long idAlmacenero = getAlmaceneroId();
            productoService.deleteProducto(id, idAlmacenero);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Producto dado de baja correctamente con id " + id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.createProducto(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @Valid @RequestBody Producto productoDetails) {
        try {
            Long idAlmacenero = getAlmaceneroId();
            Producto updatedProduct = productoService.updateProducto(id, productoDetails, idAlmacenero);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating product: " + e.getMessage());
        }
    }

    // =============================================================
    // Helpers
    // =============================================================

    private Long getAlmaceneroId() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario user = usuarioRepository.findByEmail(email);
            return (user != null) ? user.getId_usuario() : 1L;
        } catch (Exception e) {
            return 1L;
        }
    }
}
