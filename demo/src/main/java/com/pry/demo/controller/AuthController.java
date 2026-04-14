package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.pry.demo.model.Usuario;
import com.pry.demo.repository.UsuarioRepository;
import com.pry.demo.security.JwtUtil;

import java.sql.Timestamp;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario request) {
        try {
            Usuario user = usuarioRepository.findByEmail(request.getEmail());

            if (user == null) {
                return ResponseEntity.status(401).body("Usuario no encontrado");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("Contraseña incorrecta");
            }

            if (user.isMfaEnabled()) {
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("requireMfa", true);
                response.put("email", user.getEmail());
                return ResponseEntity.ok(response);
            }

            String role = user.getEmail().equals("admin@gmail.com") ? "ADMIN" : "USER";
            String token = jwtUtil.generateToken(user.getEmail(), role);
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/login/mfa")
    public ResponseEntity<?> loginMfa(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            Usuario user = usuarioRepository.findByEmail(email);

            if (user == null || !user.isMfaEnabled()) {
                return ResponseEntity.status(400).body("Usuario inválido o MFA no activo");
            }

            dev.samstevens.totp.code.CodeVerifier verifier = new dev.samstevens.totp.code.DefaultCodeVerifier(new dev.samstevens.totp.code.DefaultCodeGenerator(), new dev.samstevens.totp.time.SystemTimeProvider());
            
            if (verifier.isValidCode(user.getTotpSecret(), code)) {
                String role = user.getEmail().equals("admin@gmail.com") ? "ADMIN" : "USER";
                String token = jwtUtil.generateToken(user.getEmail(), role);
                
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("token", token);
                response.put("role", role);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Código de autenticación incorrecto");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error de servidor: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario request) {
        if (usuarioRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }
        
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setEstado(1); // Activo
        request.setFecha_registro(new Timestamp(System.currentTimeMillis()));
        
        usuarioRepository.save(request);
        
        return ResponseEntity.ok("{\"message\": \"Usuario registrado correctamente\"}");
    }
}
