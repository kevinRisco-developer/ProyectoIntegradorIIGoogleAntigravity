package com.pry.demo.shared.repository;

import com.pry.demo.modulo_ventas.enums.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.pry.demo.shared.model.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Query(value = "CALL usuario_pedido()", nativeQuery = true)
    List<Object[]> getUsuarioPedidos();

    List<Pedido> findByEstado(EstadoPedido estado);
}
