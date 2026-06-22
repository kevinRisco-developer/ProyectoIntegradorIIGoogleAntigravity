package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Rol;

public interface RolRepository extends JpaRepository<Rol, Long> {
}
