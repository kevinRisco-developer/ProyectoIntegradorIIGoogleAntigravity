package com.pry.demo.modulo_seguridad.controller;

import com.pry.demo.modulo_seguridad.service.MfaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/mfa")
@CrossOrigin(origins = "*")
public class MfaController {

    @Autowired
    private MfaService mfaService;

    @GetMapping("/status")
    public ResponseEntity<?> getMfaStatus() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            boolean isEnabled = mfaService.getMfaStatus(email);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isMfaEnabled", isEnabled);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupMfa() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            Map<String, String> response = mfaService.setupMfa(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/enable")
    public ResponseEntity<?> enableMfa(@RequestBody Map<String, String> request) {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String code = request.get("code");
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Código TOTP requerido");
        }

        try {
            boolean success = mfaService.enableMfa(email, code);
            if (success) {
                return ResponseEntity.ok("{\"message\": \"MFA habilitado correctamente\"}");
            } else {
                return ResponseEntity.status(400).body("Código TOTP inválido");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/disable")
    public ResponseEntity<?> disableMfa() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            mfaService.disableMfa(email);
            return ResponseEntity.ok("{\"message\": \"MFA deshabilitado\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
