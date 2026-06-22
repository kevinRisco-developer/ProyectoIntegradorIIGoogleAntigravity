package com.pry.demo.modulo_usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pry.demo.shared.model.Usuario_rol;
import com.pry.demo.shared.repository.Usuario_rolRepository;

import java.util.List;

@RestController
@RequestMapping("/usuario_rol")
@CrossOrigin(origins = "*")
public class Usuario_rolController {
    @Autowired
    private Usuario_rolRepository usuario_rolRepository;

    @GetMapping
    public List<Usuario_rol> getAllUsuario_rols() {
        return usuario_rolRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUsuarioRol(@PathVariable Long id) {
        Usuario_rol usuario_rol = usuario_rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario_rol not found with id " + id));
        usuario_rolRepository.delete(usuario_rol);
        return ResponseEntity.ok("Usuario_rol deleted successfully with id " + id);
    }
}
