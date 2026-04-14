package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Recomendacion;
public interface RecomendacionRepository  extends JpaRepository<Recomendacion, Long> {

}
