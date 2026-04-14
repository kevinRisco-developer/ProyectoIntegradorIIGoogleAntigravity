package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Producto;
public interface ProductoRepository  extends JpaRepository<Producto, Long>{

}
