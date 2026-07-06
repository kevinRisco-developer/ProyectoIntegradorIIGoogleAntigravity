package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.RecuperacionContrasena;

public interface RecuperacionContrasenaRepository extends JpaRepository<RecuperacionContrasena, Long> {
    RecuperacionContrasena findByToken(String token);
}
