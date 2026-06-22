package com.pry.demo.modulo_auditoria.controller;

import com.pry.demo.shared.model.AuditoriaCategoria;
import com.pry.demo.shared.repository.AuditoriaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/auditoria/categoria")
@CrossOrigin(origins = "*")
public class AuditoriaCategoriaController {

    @Autowired
    private AuditoriaCategoriaRepository auditoriaCategoriaRepository;

    /**
     * Listar todos los registros de auditoría de categorías.
     */
    @GetMapping
    public ResponseEntity<List<AuditoriaCategoria>> getAll() {
        return ResponseEntity.ok(auditoriaCategoriaRepository.findAll());
    }

    /**
     * Obtener auditorías de una categoría específica.
     */
    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<AuditoriaCategoria>> getByCategoria(@PathVariable Long idCategoria) {
        List<AuditoriaCategoria> auditorias = auditoriaCategoriaRepository.findAll().stream()
                .filter(a -> a.getId_categoria().equals(idCategoria))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Obtener auditorías realizadas por un almacenero específico.
     */
    @GetMapping("/almacenero/{idAlmacenero}")
    public ResponseEntity<List<AuditoriaCategoria>> getByAlmacenero(@PathVariable Long idAlmacenero) {
        List<AuditoriaCategoria> auditorias = auditoriaCategoriaRepository.findAll().stream()
                .filter(a -> a.getId_almacenero() != null && a.getId_almacenero().equals(idAlmacenero))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Eliminar un registro de auditoría (solo para limpieza).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!auditoriaCategoriaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        auditoriaCategoriaRepository.deleteById(id);
        return ResponseEntity.ok("Registro de auditoría eliminado con id: " + id);
    }
}
