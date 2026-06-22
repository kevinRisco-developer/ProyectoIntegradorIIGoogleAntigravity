package com.pry.demo.modulo_auditoria.controller;

import com.pry.demo.shared.model.AuditoriaProducto;
import com.pry.demo.shared.repository.AuditoriaProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/auditoria/producto")
@CrossOrigin(origins = "*")
public class AuditoriaProductoController {

    @Autowired
    private AuditoriaProductoRepository auditoriaProductoRepository;

    /**
     * Listar todos los registros de auditoría de productos.
     */
    @GetMapping
    public ResponseEntity<List<AuditoriaProducto>> getAll() {
        return ResponseEntity.ok(auditoriaProductoRepository.findAll());
    }

    /**
     * Obtener auditorías de un producto específico.
     */
    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<AuditoriaProducto>> getByProducto(@PathVariable Long idProducto) {
        List<AuditoriaProducto> auditorias = auditoriaProductoRepository.findAll().stream()
                .filter(a -> a.getId_producto().equals(idProducto))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Obtener auditorías realizadas por un almacenero específico.
     */
    @GetMapping("/almacenero/{idAlmacenero}")
    public ResponseEntity<List<AuditoriaProducto>> getByAlmacenero(@PathVariable Long idAlmacenero) {
        List<AuditoriaProducto> auditorias = auditoriaProductoRepository.findAll().stream()
                .filter(a -> a.getId_almacenero() != null && a.getId_almacenero().equals(idAlmacenero))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Eliminar un registro de auditoría (solo para limpieza).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!auditoriaProductoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        auditoriaProductoRepository.deleteById(id);
        return ResponseEntity.ok("Registro de auditoría eliminado con id: " + id);
    }
}
