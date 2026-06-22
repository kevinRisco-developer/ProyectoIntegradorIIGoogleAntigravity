package com.pry.demo.modulo_recomendacion.controller;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.HistorialRepository;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_recomendacion.service.RecomendacionService;
import com.pry.demo.modulo_integraciones.service.EmailService;
import com.pry.demo.modulo_integraciones.service.MarketingScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recomendacion")
@CrossOrigin(origins = "*")
public class RecomendacionController {

    @Autowired
    private RecomendacionService recomendacionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistorialRepository historialRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MarketingScheduler marketingScheduler;

    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    /**
     * Obtener recomendaciones personalizadas del usuario autenticado
     * consumiendo la API de Python.
     */
    @GetMapping("/smart")
    public ResponseEntity<?> getSmartRecommendations() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");
        List<Producto> recomendaciones = recomendacionService.getProductsForUser(user);
        return ResponseEntity.ok(recomendaciones);
    }

    /**
     * Enviar ofertas personalizadas por email al usuario autenticado.
     */
    @PostMapping("/send-offers")
    public ResponseEntity<?> sendSmartOffers() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        List<Producto> recs = recomendacionService.getProductsForUser(user);
        if (!recs.isEmpty()) {
            emailService.sendPersonalizedOffers(user, recs);
            return ResponseEntity.ok(Map.of("message", "Ofertas enviadas exitosamente"));
        }
        return ResponseEntity.ok(Map.of("message", "No hay recomendaciones para enviar"));
    }

    /**
     * Disparar manualmente el batch semanal de marketing (solo ADMIN).
     */
    @PostMapping("/test-batch-email")
    public ResponseEntity<?> triggerTestBatch() {
        marketingScheduler.triggerManualBatch();
        return ResponseEntity.ok(Map.of("message", "Proceso de envío masivo iniciado (Ver logs de consola)"));
    }

    /**
     * Obtener historial de interacciones del usuario autenticado.
     */
    @GetMapping("/historial")
    public ResponseEntity<?> getHistorial() {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        var historial = historialRepository.findAll().stream()
                .filter(h -> h.getId_usuario() != null && h.getId_usuario().equals(user.getId_usuario()))
                .toList();
        return ResponseEntity.ok(historial);
    }

    /**
     * Registrar una interacción de usuario con un producto.
     * Body: { "id_producto": 5, "accion": "VIEW", "permanencia": 30 }
     */
    @PostMapping("/historial")
    public ResponseEntity<?> registrarInteraccion(@RequestBody Map<String, Object> request) {
        Usuario user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).body("No autenticado");

        com.pry.demo.shared.model.Historial historial = new com.pry.demo.shared.model.Historial();
        historial.setId_usuario(user.getId_usuario());
        historial.setId_producto(Long.valueOf(request.get("id_producto").toString()));
        historial.setAccion(request.get("accion").toString());
        historial.setPermanencia(Integer.parseInt(request.get("permanencia").toString()));
        historial.setFecha(new Timestamp(System.currentTimeMillis()));
        historialRepository.save(historial);

        return ResponseEntity.ok(Map.of("message", "Interacción registrada"));
    }
}
