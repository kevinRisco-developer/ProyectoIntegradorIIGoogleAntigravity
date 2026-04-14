package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
