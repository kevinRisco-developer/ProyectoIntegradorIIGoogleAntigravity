package com.pry.demo.modulo_seguridad.service;

import com.pry.demo.shared.model.RecuperacionContrasena;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.RecuperacionContrasenaRepository;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_integraciones.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.UUID;

@Service
public class RecuperacionPasswordService {

    // Vigencia del token de recuperación: 15 minutos.
    private static final long TOKEN_TTL_MS = 15 * 60 * 1000;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RecuperacionContrasenaRepository recuperacionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void generarYEnviarTokenRecuperacion(String email) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("El correo electrónico no está registrado");
        }

        // Generar token de un solo uso y persistirlo con su expiración.
        String token = UUID.randomUUID().toString();
        Timestamp expiracion = new Timestamp(System.currentTimeMillis() + TOKEN_TTL_MS);

        RecuperacionContrasena recuperacion = new RecuperacionContrasena(user.getId_usuario(), token, expiracion);
        recuperacionRepository.save(recuperacion);

        // Enviar enlace de restablecimiento por correo (Gmail SMTP).
        emailService.sendPasswordResetLink(email, token);
    }

    public void restablecerContrasena(String token, String nuevaContrasena) {
        RecuperacionContrasena recuperacion = recuperacionRepository.findByToken(token);
        if (recuperacion == null) {
            throw new IllegalArgumentException("Token de recuperación inválido o inexistente");
        }

        if (recuperacion.isUsado()) {
            throw new IllegalArgumentException("El token ya fue utilizado");
        }

        if (System.currentTimeMillis() > recuperacion.getExpira_en().getTime()) {
            throw new IllegalArgumentException("El token ha expirado");
        }

        Usuario user = usuarioRepository.findById(recuperacion.getId_usuario()).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        // Actualizar contraseña y marcar el token como usado.
        user.setPassword(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(user);

        recuperacion.setUsado(true);
        recuperacionRepository.save(recuperacion);
    }
}
