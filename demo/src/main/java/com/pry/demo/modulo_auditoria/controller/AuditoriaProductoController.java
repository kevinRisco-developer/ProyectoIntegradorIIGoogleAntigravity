package com.pry.demo.modulo_auditoria.controller;

import com.pry.demo.modulo_auditoria.util.FiltroFechas;
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
     * Consulta filtrada por rango de fechas, responsable (id_almacenero) y tipo de acción (HU-32).
     */
    @GetMapping("/filtrar")
    public ResponseEntity<List<AuditoriaProducto>> filtrar(
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(required = false) Long responsable,
            @RequestParam(required = false) String accion) {
        return ResponseEntity.ok(auditoriaProductoRepository.filtrar(
                FiltroFechas.desde(desde), FiltroFechas.hasta(hasta), responsable, FiltroFechas.nb(accion)));
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
