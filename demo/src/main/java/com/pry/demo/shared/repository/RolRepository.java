package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Rol;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String nombre);
}
