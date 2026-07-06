package com.pry.demo.shared.repository;

import com.pry.demo.modulo_ventas.enums.EstadoPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pry.demo.shared.model.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Query(value = "CALL usuario_pedido()", nativeQuery = true)
    List<Object[]> getUsuarioPedidos();

    List<Pedido> findByEstado(EstadoPedido estado);

    // Historial paginado de los pedidos de un cliente (HU-14).
    // @Query explícito: el nombre del campo `id_usuario` con guion bajo confunde al
    // derivador de consultas de Spring Data 4 (lo interpreta como propiedad anidada id.usuario).
    @Query("SELECT p FROM Pedido p WHERE p.id_usuario = :idUsuario")
    Page<Pedido> findPedidosByUsuario(@Param("idUsuario") Long idUsuario, Pageable pageable);
}
