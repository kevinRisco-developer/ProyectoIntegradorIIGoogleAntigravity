package com.pry.demo.modulo_auditoria.controller;

import com.pry.demo.modulo_auditoria.util.FiltroFechas;
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
     * Consulta filtrada por rango de fechas, responsable (id_almacenero) y tipo de acción (HU-33).
     */
    @GetMapping("/filtrar")
    public ResponseEntity<List<AuditoriaCategoria>> filtrar(
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(required = false) Long responsable,
            @RequestParam(required = false) String accion) {
        return ResponseEntity.ok(auditoriaCategoriaRepository.filtrar(
                FiltroFechas.desde(desde), FiltroFechas.hasta(hasta), responsable, FiltroFechas.nb(accion)));
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
