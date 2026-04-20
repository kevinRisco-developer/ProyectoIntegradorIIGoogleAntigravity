package com.pry.demo.repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Query(value = "CALL productosMasVendidos()", nativeQuery = true)
    List<Object[]> getProductosMasVendidos();
}
