package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.AuditoriaUsuario;

public interface AuditoriaUsuarioRepository extends JpaRepository<AuditoriaUsuario, Long> {
}
