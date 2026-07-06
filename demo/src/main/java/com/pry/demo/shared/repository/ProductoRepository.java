package com.pry.demo.shared.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

       Page<Producto> findByEstado(int estado, Pageable pageable);

       @Query(value = "SELECT * FROM producto WHERE id_categoria = :idCategoria AND estado = :estado", countQuery = "SELECT count(*) FROM producto WHERE id_categoria = :idCategoria AND estado = :estado", nativeQuery = true)
       Page<Producto> findByIdCategoriaAndEstado(@Param("idCategoria") int idCategoria, @Param("estado") int estado,
                     Pageable pageable);

       @Query(value = "SELECT * FROM producto WHERE estado = 1 AND MATCH(nombre) AGAINST (:termino IN BOOLEAN MODE)", countQuery = "SELECT count(*) FROM producto WHERE estado = 1 AND MATCH(nombre) AGAINST (:termino IN BOOLEAN MODE)", nativeQuery = true)
       Page<Producto> searchByNameFulltext(@Param("termino") String termino, Pageable pageable);
}
