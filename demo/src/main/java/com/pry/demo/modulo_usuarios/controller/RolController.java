package com.pry.demo.modulo_usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pry.demo.shared.model.Rol;
import com.pry.demo.shared.repository.RolRepository;

import java.util.List;

@RestController
@RequestMapping("/rol")
@CrossOrigin(origins = "*")
public class RolController {
    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    public List<Rol> getAllRols() {
        return rolRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRol(@PathVariable Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol not found with id " + id));
        rolRepository.delete(rol);
        return ResponseEntity.ok("Rol deleted successfully with id " + id);
    }

    @PostMapping
    public Rol createRol(@RequestBody Rol rol) {
        return rolRepository.save(rol);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> updateRol(@PathVariable Long id, @RequestBody Rol rolDetails) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol not found with id " + id));
        rol.setNombre(rolDetails.getNombre());
        return ResponseEntity.ok(rolRepository.save(rol));
    }
}
