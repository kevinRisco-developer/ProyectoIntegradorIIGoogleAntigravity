package com.pry.demo.modulo_auditoria.controller;

import com.pry.demo.modulo_auditoria.util.FiltroFechas;
import com.pry.demo.shared.model.AuditoriaUsuario;
import com.pry.demo.shared.repository.AuditoriaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/auditoria/usuario")
@CrossOrigin(origins = "*")
public class AuditoriaUsuarioController {

    @Autowired
    private AuditoriaUsuarioRepository auditoriaUsuarioRepository;

    /**
     * Listar todos los registros de auditoría de usuarios.
     */
    @GetMapping
    public ResponseEntity<List<AuditoriaUsuario>> getAll() {
        return ResponseEntity.ok(auditoriaUsuarioRepository.findAll());
    }

    /**
     * Consulta filtrada por rango de fechas, responsable (id_admin) y tipo de acción (HU-31).
     */
    @GetMapping("/filtrar")
    public ResponseEntity<List<AuditoriaUsuario>> filtrar(
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(required = false) Long responsable,
            @RequestParam(required = false) String accion) {
        return ResponseEntity.ok(auditoriaUsuarioRepository.filtrar(
                FiltroFechas.desde(desde), FiltroFechas.hasta(hasta), responsable, FiltroFechas.nb(accion)));
    }

    /**
     * Obtener auditorías relacionadas a un usuario específico.
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<AuditoriaUsuario>> getByUsuario(@PathVariable Long idUsuario) {
        List<AuditoriaUsuario> auditorias = auditoriaUsuarioRepository.findAll().stream()
                .filter(a -> a.getId_usuario() != null && a.getId_usuario().equals(idUsuario))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Obtener auditorías realizadas por un admin específico.
     */
    @GetMapping("/admin/{idAdmin}")
    public ResponseEntity<List<AuditoriaUsuario>> getByAdmin(@PathVariable Long idAdmin) {
        List<AuditoriaUsuario> auditorias = auditoriaUsuarioRepository.findAll().stream()
                .filter(a -> a.getId_admin() != null && a.getId_admin().equals(idAdmin))
                .toList();
        return ResponseEntity.ok(auditorias);
    }

    /**
     * Eliminar un registro de auditoría (solo para limpieza).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!auditoriaUsuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        auditoriaUsuarioRepository.deleteById(id);
        return ResponseEntity.ok("Registro de auditoría eliminado con id: " + id);
    }
}
