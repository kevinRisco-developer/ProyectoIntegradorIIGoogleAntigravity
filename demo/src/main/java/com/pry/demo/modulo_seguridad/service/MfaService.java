package com.pry.demo.modulo_seguridad.service;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MfaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public boolean getMfaStatus(String email) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        return user.isMfaEnabled();
    }

    public Map<String, String> setupMfa(String email) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
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

        return response;
    }

    public boolean enableMfa(String email, String code) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        CodeVerifier verifier = new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
        if (verifier.isValidCode(user.getTotpSecret(), code)) {
            user.setMfaEnabled(true);
            usuarioRepository.save(user);
            return true;
        }
        return false;
    }

    public void disableMfa(String email) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        user.setMfaEnabled(false);
        user.setTotpSecret(null);
        usuarioRepository.save(user);
    }
}
