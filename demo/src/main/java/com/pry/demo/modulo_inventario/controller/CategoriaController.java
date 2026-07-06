package com.pry.demo.modulo_inventario.controller;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_inventario.dto.CategoriaDTO;
import com.pry.demo.modulo_inventario.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // =============================================================
    // Endpoints PÚBLICOS — accesibles por CLIENTES sin autenticación
    // =============================================================

    /** Lista las categorías activas (estado=1) para el catálogo público. */
    @GetMapping("/public")
    public ResponseEntity<List<CategoriaDTO>> getCategoriasPublic() {
        return ResponseEntity.ok(categoriaService.getCategoriasActivas());
    }

    // =============================================================
    // Endpoints de administración — solo INVENTARIO
    // =============================================================

    /** Lista todas las categorías (incluye dadas de baja). Solo INVENTARIO/ADMIN. */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> getAllCategorias() {
        return ResponseEntity.ok(categoriaService.getAllCategorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoriaById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(categoriaService.getCategoriaById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> createCategoria(@RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.createCategoria(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategoria(@PathVariable Long id, @RequestBody CategoriaDTO dto) {
        try {
            Long idAlmacenero = getAlmaceneroId();
            return ResponseEntity.ok(categoriaService.updateCategoria(id, dto, idAlmacenero));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Baja lógica: cambia estado a 0 en lugar de eliminar físicamente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Long id) {
        try {
            Long idAlmacenero = getAlmaceneroId();
            categoriaService.deleteCategoria(id, idAlmacenero);
            return ResponseEntity.ok("{\"message\": \"Categoría dada de baja correctamente con id " + id + "\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
