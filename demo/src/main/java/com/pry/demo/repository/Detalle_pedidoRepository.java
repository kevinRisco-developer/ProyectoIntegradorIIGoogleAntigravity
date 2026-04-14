package com.pry.demo.repository;

import com.pry.demo.model.Detalle_pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface Detalle_pedidoRepository extends JpaRepository<Detalle_pedido, Long> {
    @Query("SELECT d FROM Detalle_pedido d WHERE d.id_pedido = :id_pedido")
    List<Detalle_pedido> findById_pedido(@Param("id_pedido") Long id_pedido);
}
