package com.pry.demo.modulo_seguridad.service;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.model.Usuario_rol;
import com.pry.demo.shared.model.Rol;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.shared.repository.Usuario_rolRepository;
import com.pry.demo.shared.repository.RolRepository;
import com.pry.demo.shared.security.JwtUtil;
import com.pry.demo.modulo_seguridad.dto.LoginRequestDTO;
import com.pry.demo.modulo_seguridad.dto.LoginResponseDTO;
import com.pry.demo.modulo_seguridad.dto.MfaRequestDTO;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private Usuario_rolRepository usuarioRolRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO request) throws Exception {
        Usuario user = usuarioRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        if (user.isMfaEnabled()) {
            return new LoginResponseDTO(null, null, null, user.getId_usuario(), true, user.getEmail());
        }

        String role = getUserRoleName(user.getId_usuario());
        String token = jwtUtil.generateToken(user.getEmail(), role);

        return new LoginResponseDTO(token, role, user.getNombre(), user.getId_usuario(), false, user.getEmail());
    }

    public LoginResponseDTO loginMfa(MfaRequestDTO request) throws Exception {
        Usuario user = usuarioRepository.findByEmail(request.getEmail());

        if (user == null || !user.isMfaEnabled()) {
            throw new IllegalArgumentException("Usuario inválido o MFA no activo");
        }

        CodeVerifier verifier = new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
        if (!verifier.isValidCode(user.getTotpSecret(), request.getCode())) {
            throw new IllegalArgumentException("Código de autenticación incorrecto");
        }

        String role = getUserRoleName(user.getId_usuario());
        String token = jwtUtil.generateToken(user.getEmail(), role);

        return new LoginResponseDTO(token, role, user.getNombre(), user.getId_usuario(), false, user.getEmail());
    }

    public Usuario register(Usuario request) {
        if (usuarioRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setEstado(1); // Activo
        request.setFecha_registro(new Timestamp(System.currentTimeMillis()));

        Usuario savedUser = usuarioRepository.save(request);

        // Assign CLIENTE role (ID 2) by default
        Usuario_rol userRol = new Usuario_rol();
        userRol.setId_usuario(savedUser.getId_usuario());
        userRol.setId_rol(2L);
        usuarioRolRepository.save(userRol);

        return savedUser;
    }

    public String getUserRoleName(Long idUsuario) {
        // Find role mapping
        Optional<Usuario_rol> userRolOpt = usuarioRolRepository.findAll().stream()
                .filter(ur -> ur.getId_usuario().equals(idUsuario))
                .findFirst();

        if (userRolOpt.isPresent()) {
            Long idRol = userRolOpt.get().getId_rol();
            Optional<Rol> rolOpt = rolRepository.findById(idRol);
            if (rolOpt.isPresent()) {
                return rolOpt.get().getNombre().toUpperCase(); // ADMIN, CLIENTE, INVENTARIO
            }
        }

        // Default fallback if no role is mapped
        return "CLIENTE";
    }
}
