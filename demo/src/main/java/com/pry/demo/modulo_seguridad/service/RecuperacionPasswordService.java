package com.pry.demo.modulo_seguridad.service;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_integraciones.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RecuperacionPasswordService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Cache to store token -> TokenInfo
    private final Map<String, TokenInfo> tokenCache = new ConcurrentHashMap<>();

    private static class TokenInfo {
        String email;
        long expirationTime;

        TokenInfo(String email, long expirationTime) {
            this.email = email;
            this.expirationTime = expirationTime;
        }
    }

    public void generarYEnviarTokenRecuperacion(String email) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("El correo electrónico no está registrado");
        }

        // Generate temporary token
        String token = UUID.randomUUID().toString();
        // Set TTL to 15 minutes
        long expiration = System.currentTimeMillis() + (15 * 60 * 1000);
        tokenCache.put(token, new TokenInfo(email, expiration));

        // Send reset link using EmailService
        emailService.sendPasswordResetLink(email, token);
    }

    public void restablecerContrasena(String token, String nuevaContrasena) {
        TokenInfo info = tokenCache.get(token);
        if (info == null) {
            throw new IllegalArgumentException("Token de recuperación inválido o inexistente");
        }

        if (System.currentTimeMillis() > info.expirationTime) {
            tokenCache.remove(token);
            throw new IllegalArgumentException("El token ha expirado");
        }

        Usuario user = usuarioRepository.findByEmail(info.email);
        if (user == null) {
            tokenCache.remove(token);
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(user);

        // Remove token from cache
        tokenCache.remove(token);
    }
}
