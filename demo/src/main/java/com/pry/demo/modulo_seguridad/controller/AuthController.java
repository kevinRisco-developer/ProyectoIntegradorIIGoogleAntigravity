package com.pry.demo.modulo_seguridad.controller;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.modulo_seguridad.dto.LoginRequestDTO;
import com.pry.demo.modulo_seguridad.dto.LoginResponseDTO;
import com.pry.demo.modulo_seguridad.dto.MfaRequestDTO;
import com.pry.demo.modulo_seguridad.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/login/mfa")
    public ResponseEntity<?> loginMfa(@Valid @RequestBody MfaRequestDTO request) {
        try {
            LoginResponseDTO response = authService.loginMfa(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            LoginResponseDTO response = authService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario request) {
        try {
            Usuario user = authService.register(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario registrado correctamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }
}
