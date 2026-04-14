package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Historial;
public interface HistorialRepository  extends JpaRepository<Historial, Long> {

}
