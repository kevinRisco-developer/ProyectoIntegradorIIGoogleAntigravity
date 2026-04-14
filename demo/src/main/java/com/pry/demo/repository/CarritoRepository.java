package com.pry.demo.repository;

import com.pry.demo.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    @Query("SELECT c FROM Carrito c WHERE c.id_usuario = :id_usuario")
    Carrito findById_usuario(@Param("id_usuario") Long id_usuario);
}
