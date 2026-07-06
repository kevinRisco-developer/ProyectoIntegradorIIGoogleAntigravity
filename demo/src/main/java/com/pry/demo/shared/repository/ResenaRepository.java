package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    // @Query explícito: los campos con guion bajo rompen los métodos derivados en Spring Data 4.
    @Query("SELECT r FROM Resena r WHERE r.id_producto = :pid ORDER BY r.fecha DESC")
    List<Resena> findByProducto(@Param("pid") Long pid);

    @Query("SELECT r FROM Resena r WHERE r.id_usuario = :uid AND r.id_producto = :pid")
    Resena findByUsuarioAndProducto(@Param("uid") Long uid, @Param("pid") Long pid);

    @Query("SELECT AVG(r.calificacion) FROM Resena r WHERE r.id_producto = :pid")
    Double promedioByProducto(@Param("pid") Long pid);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.id_producto = :pid")
    long countByProducto(@Param("pid") Long pid);
}
