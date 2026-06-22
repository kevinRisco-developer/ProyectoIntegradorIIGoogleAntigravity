package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.AuditoriaCategoria;

public interface AuditoriaCategoriaRepository extends JpaRepository<AuditoriaCategoria, Long> {
}
