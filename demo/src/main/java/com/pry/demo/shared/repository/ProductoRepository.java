package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Query(value = "CALL productosMasVendidos()", nativeQuery = true)
    List<Object[]> getProductosMasVendidos();

    @Query(value = "CALL `5_productoMasVendidos`()", nativeQuery = true)
    List<Object[]> getTop5ProductosMasVendidos();

    @Query(value = "CALL producto_categoria()", nativeQuery = true)
    List<Object[]> getProductosConCategoria();
}
