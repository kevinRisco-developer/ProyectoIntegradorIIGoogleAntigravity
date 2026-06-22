package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.AuditoriaProducto;

public interface AuditoriaProductoRepository extends JpaRepository<AuditoriaProducto, Long> {
}
