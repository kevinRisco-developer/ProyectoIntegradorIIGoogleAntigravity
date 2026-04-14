package com.pry.demo.controller;

import com.pry.demo.model.Usuario;
import com.pry.demo.repository.UsuarioRepository;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
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
    private UsuarioRepository usuarioRepository;

    @GetMapping("/status")
    public ResponseEntity<?> getMfaStatus() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Map<String, Boolean> response = new HashMap<>();
        response.put("isMfaEnabled", user.isMfaEnabled());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupMfa() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = usuarioRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();

        user.setTotpSecret(secret);
        usuarioRepository.save(user);

        QrData data = new QrData.Builder()
                .label(user.getEmail())
                .secret(secret)
                .issuer("ImportSmart")
                .build();

        Map<String, String> response = new HashMap<>();
        response.put("secret", secret);
        response.put("qrUri", data.getUri());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/enable")
    public ResponseEntity<?> enableMfa(@RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = usuarioRepository.findByEmail(email);
        String code = request.get("code");

        CodeVerifier verifier = new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
        if (verifier.isValidCode(user.getTotpSecret(), code)) {
            user.setMfaEnabled(true);
            usuarioRepository.save(user);
            return ResponseEntity.ok("{\"message\": \"MFA habilitado correctamente\"}");
        } else {
            return ResponseEntity.status(400).body("Código TOTP inválido");
        }
    }

    @PostMapping("/disable")
    public ResponseEntity<?> disableMfa() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = usuarioRepository.findByEmail(email);

        user.setMfaEnabled(false);
        user.setTotpSecret(null);
        usuarioRepository.save(user);
        return ResponseEntity.ok("{\"message\": \"MFA deshabilitado\"}");
    }
}
