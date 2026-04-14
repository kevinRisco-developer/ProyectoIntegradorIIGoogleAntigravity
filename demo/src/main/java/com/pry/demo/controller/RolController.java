package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Rol;
import com.pry.demo.repository.RolRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/rol")
public class RolController {
    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    public List<Rol> getAllRols() {
        return rolRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteRol(@PathVariable Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol not found with id " + id));
        rolRepository.delete(rol);
        return "Rol deleted successfully with id " + id;
    }

    @PostMapping
    public Rol createRol(@RequestBody Rol rol) {
        return rolRepository.save(rol);
    }

    @PutMapping("/{id}")
    public Rol updateRol(@PathVariable Long id, @RequestBody Rol rolDetails) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol not found with id " + id));
        rol.setNombre(rolDetails.getNombre());
        return rolRepository.save(rol);
    }

}
