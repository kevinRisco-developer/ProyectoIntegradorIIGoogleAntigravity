package com.pry.demo.repository;

import com.pry.demo.model.Carrito_detalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface Carrito_detalleRepository extends JpaRepository<Carrito_detalle, Long> {
    @Query("SELECT d FROM Carrito_detalle d WHERE d.id_carrito = :id_carrito")
    List<Carrito_detalle> findById_carrito(@Param("id_carrito") Long id_carrito);
}
