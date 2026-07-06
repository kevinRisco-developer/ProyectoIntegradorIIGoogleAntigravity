package com.pry.demo.modulo_recomendacion.controller;

import com.pry.demo.shared.model.Historial;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_recomendacion.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoint del servicio de historial de comportamiento (Sprint IA).
 * Recibe los eventos enviados desde Angular (VIEW >=5s, CLICK, ADD_CART).
 */
@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialController {

    @Autowired
    private HistorialService historialService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getAuthenticatedUser() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            return usuarioRepository.findByEmail(email);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Registra una interacción del usuario con un producto.
     * Body: { "id_producto": 5, "accion": "VIEW", "permanencia": 7 }
     */
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> body) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        try {
            Long idProducto = Long.valueOf(body.get("id_producto").toString());
            String accion = body.get("accion") != null ? body.get("accion").toString() : null;
            Integer permanencia = body.get("permanencia") != null
                    ? Integer.parseInt(body.get("permanencia").toString()) : 0;

            Historial h = historialService.registrar(user.getId_usuario(), idProducto, accion, permanencia);
            return ResponseEntity.ok(Map.of("message", "Evento registrado", "id_historial", h.getId_historial()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payload inválido: " + e.getMessage()));
        }
    }

    /** Historial de interacciones del usuario autenticado. */
    @GetMapping
    public ResponseEntity<?> misInteracciones() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        List<Historial> historial = historialService.getByUsuario(user.getId_usuario());
        return ResponseEntity.ok(historial);
    }
}
