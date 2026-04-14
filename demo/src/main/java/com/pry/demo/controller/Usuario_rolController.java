package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Usuario_rol;
import com.pry.demo.repository.Usuario_rolRepository;

@RestController
@RequestMapping("/usuario_rol")
public class Usuario_rolController {
    @Autowired
    private Usuario_rolRepository usuario_rolRepository;

    @GetMapping
    public List<Usuario_rol> getAllUsuario_rols() {
        return usuario_rolRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteUsuarioRol(@PathVariable Long id) {
        Usuario_rol usuario_rol = usuario_rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario_rol not found with id " + id));
        usuario_rolRepository.delete(usuario_rol);
        return "Usuario_rol deleted successfully with id " + id;
    }
}
