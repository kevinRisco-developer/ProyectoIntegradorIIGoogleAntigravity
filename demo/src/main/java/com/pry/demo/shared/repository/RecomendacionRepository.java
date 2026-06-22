package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Recomendacion;

public interface RecomendacionRepository extends JpaRepository<Recomendacion, Long> {
}
