package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
}
