package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pry.demo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);

}
