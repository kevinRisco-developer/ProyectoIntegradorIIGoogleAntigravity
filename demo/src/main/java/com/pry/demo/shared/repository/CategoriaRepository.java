package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
