package com.pry.demo.modulo_usuarios.service;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.model.Usuario_rol;
import com.pry.demo.shared.model.Rol;
import com.pry.demo.shared.model.AuditoriaUsuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.shared.repository.Usuario_rolRepository;
import com.pry.demo.shared.repository.RolRepository;
import com.pry.demo.shared.repository.AuditoriaUsuarioRepository;
import com.pry.demo.modulo_usuarios.dto.UsuarioDTO;
import com.pry.demo.modulo_usuarios.dto.UsuarioUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private Usuario_rolRepository usuarioRolRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private AuditoriaUsuarioRepository auditoriaUsuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO getUsuarioById(Long id) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id " + id));
        return mapToDTO(user);
    }

    @Transactional
    public void deleteUsuario(Long id) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id " + id));

        // Baja LÓGICA (HU-29): no se elimina físicamente, se desactiva con estado = 0.
        // Se conserva el mapeo de rol para poder reactivarlo luego.
        user.setEstado(0);
        usuarioRepository.save(user);
    }

    public Usuario createUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario savedUser = usuarioRepository.save(usuario);

        // Assign CLIENTE role (2) by default if not set
        boolean hasRole = usuarioRolRepository.findAll().stream()
                .anyMatch(ur -> ur.getId_usuario().equals(savedUser.getId_usuario()));
        if (!hasRole) {
            Usuario_rol ur = new Usuario_rol();
            ur.setId_usuario(savedUser.getId_usuario());
            ur.setId_rol(2L);
            usuarioRolRepository.save(ur);
        }

        return savedUser;
    }

    @Transactional
    public Usuario updateUsuario(Long id, UsuarioUpdateDTO details, Long idAdmin) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id " + id));

        // 1. Audit previous state
        AuditoriaUsuario audit = new AuditoriaUsuario();
        audit.setId_usuario(usuario.getId_usuario());
        audit.setNombre(usuario.getNombre());
        audit.setEmail(usuario.getEmail());
        audit.setPassword(usuario.getPassword());
        audit.setIs_mfa_enabled(usuario.isMfaEnabled());
        audit.setTotp_secret(usuario.getTotpSecret());
        audit.setId_admin(idAdmin);
        audit.setAccion("MODIFICACION");
        audit.setFecha(new java.sql.Timestamp(System.currentTimeMillis()));
        auditoriaUsuarioRepository.save(audit);

        // 2. Apply updates
        if (details.getNombre() != null) {
            usuario.setNombre(details.getNombre());
        }
        if (details.getEmail() != null) {
            usuario.setEmail(details.getEmail());
        }
        if (details.getPassword() != null && !details.getPassword().trim().isEmpty()) {
            // Encode if it's new plain text password
            if (!details.getPassword().startsWith("$2a$") && !details.getPassword().equals(usuario.getPassword())) {
                usuario.setPassword(passwordEncoder.encode(details.getPassword()));
            } else {
                usuario.setPassword(details.getPassword());
            }
        }
        usuario.setEstado(details.getEstado());

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void assignRole(Long idUsuario, Long idRol) {
        Usuario user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id " + idUsuario));

        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado con id " + idRol));

        // Check if mapping exists
        Optional<Usuario_rol> urOpt = usuarioRolRepository.findAll().stream()
                .filter(ur -> ur.getId_usuario().equals(idUsuario))
                .findFirst();

        if (urOpt.isPresent()) {
            Usuario_rol ur = urOpt.get();
            ur.setId_rol(idRol);
            usuarioRolRepository.save(ur);
        } else {
            Usuario_rol ur = new Usuario_rol();
            ur.setId_usuario(idUsuario);
            ur.setId_rol(idRol);
            usuarioRolRepository.save(ur);
        }
    }

    private UsuarioDTO mapToDTO(Usuario user) {
        String roleName = "CLIENTE";
        Optional<Usuario_rol> urOpt = usuarioRolRepository.findAll().stream()
                .filter(ur -> ur.getId_usuario().equals(user.getId_usuario()))
                .findFirst();

        if (urOpt.isPresent()) {
            Long idRol = urOpt.get().getId_rol();
            Optional<Rol> rolOpt = rolRepository.findById(idRol);
            if (rolOpt.isPresent()) {
                roleName = rolOpt.get().getNombre().toUpperCase();
            }
        }

        return new UsuarioDTO(
                user.getId_usuario(),
                user.getNombre(),
                user.getEmail(),
                user.getEstado(),
                user.getFecha_registro(),
                user.isMfaEnabled(),
                roleName
        );
    }
}
