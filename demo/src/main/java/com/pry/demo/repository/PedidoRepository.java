package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Pedido;
public interface PedidoRepository  extends JpaRepository<Pedido, Long>{

}
