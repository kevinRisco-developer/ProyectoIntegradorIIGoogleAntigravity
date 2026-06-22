package com.pry.demo.modulo_seguridad.controller;

import com.pry.demo.modulo_seguridad.dto.RecuperacionRequestDTO;
import com.pry.demo.modulo_seguridad.dto.ResetPasswordDTO;
import com.pry.demo.modulo_seguridad.service.RecuperacionPasswordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class RecuperacionController {

    @Autowired
    private RecuperacionPasswordService recuperacionPasswordService;

    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperar(@Valid @RequestBody RecuperacionRequestDTO request) {
        try {
            recuperacionPasswordService.generarYEnviarTokenRecuperacion(request.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Enlace de recuperación enviado al correo electrónico.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDTO request) {
        try {
            recuperacionPasswordService.restablecerContrasena(request.getToken(), request.getPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Contraseña restablecida correctamente.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }
}
