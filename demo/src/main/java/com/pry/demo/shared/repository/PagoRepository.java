package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pry.demo.shared.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    
    @Query("SELECT p FROM Pago p WHERE p.id_pedido = :idPedido")
    Pago findById_pedido(@Param("idPedido") Long idPedido);
}
