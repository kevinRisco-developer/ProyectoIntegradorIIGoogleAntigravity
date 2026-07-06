package com.pry.demo.modulo_resenas.controller;

import com.pry.demo.modulo_resenas.dto.ResenaRequestDTO;
import com.pry.demo.modulo_resenas.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/resena")
@CrossOrigin(origins = "*")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    private String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * Crea o actualiza la reseña del cliente autenticado (solo productos comprados).
     * HU: Reseñas y calificación de productos comprados.
     */
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ResenaRequestDTO request) {
        try {
            return ResponseEntity.ok(resenaService.crearOActualizar(getEmail(), request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al guardar la reseña"));
        }
    }

    /** Reseñas públicas de un producto + promedio y total. */
    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<?> porProducto(@PathVariable Long idProducto) {
        return ResponseEntity.ok(resenaService.listarPorProducto(idProducto));
    }

    /** Estado del usuario autenticado frente al producto: puede reseñar / ya reseñó / su reseña. */
    @GetMapping("/estado/{idProducto}")
    public ResponseEntity<?> estado(@PathVariable Long idProducto) {
        return ResponseEntity.ok(resenaService.estadoParaUsuario(getEmail(), idProducto));
    }
}
