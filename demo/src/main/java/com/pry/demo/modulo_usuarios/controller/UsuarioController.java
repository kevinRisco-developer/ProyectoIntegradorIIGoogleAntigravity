package com.pry.demo.modulo_usuarios.controller;

import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_usuarios.dto.UsuarioDTO;
import com.pry.demo.modulo_usuarios.dto.UsuarioUpdateDTO;
import com.pry.demo.modulo_usuarios.dto.RolAsignacionDTO;
import com.pry.demo.modulo_usuarios.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Long id) {
        try {
            UsuarioDTO dto = usuarioService.getUsuarioById(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.ok("Usuario deleted successfully with id " + id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario savedUser = usuarioService.createUsuario(usuario);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear usuario: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateDTO details) {
        try {
            // Retrieve current logged-in admin username
            String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario admin = usuarioRepository.findByEmail(adminEmail);
            Long idAdmin = (admin != null) ? admin.getId_usuario() : 1L; // Fallback to seeded admin

            Usuario updatedUser = usuarioService.updateUsuario(id, details, idAdmin);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/rol")
    public ResponseEntity<?> assignRole(@PathVariable Long id, @RequestBody RolAsignacionDTO request) {
        try {
            if (request.getId_rol() == null) {
                return ResponseEntity.badRequest().body("id_rol es requerido");
            }
            usuarioService.assignRole(id, request.getId_rol());
            return ResponseEntity.ok("{\"message\": \"Rol asignado correctamente\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
