package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.Detalle_pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface Detalle_pedidoRepository extends JpaRepository<Detalle_pedido, Long> {
    @Query("SELECT d FROM Detalle_pedido d WHERE d.id_pedido = :id_pedido")
    List<Detalle_pedido> findById_pedido(@Param("id_pedido") Long id_pedido);

    @Query(value = "CALL detallePedido_producto()", nativeQuery = true)
    List<Object[]> getDetallePedidoProductos();

    // ¿El usuario COMPRÓ este producto? (pedido pagado o entregado). Usado por reseñas.
    @Query(value = "SELECT COUNT(*) FROM detalle_pedido dp JOIN pedido p ON dp.id_pedido = p.id_pedido " +
            "WHERE p.id_usuario = :uid AND dp.id_producto = :pid AND p.estado IN ('PAGADO','ENTREGADO')",
            nativeQuery = true)
    long countComprasProducto(@Param("uid") Long uid, @Param("pid") Long pid);
}
