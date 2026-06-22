package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HistorialRepository extends JpaRepository<Historial, Long> {
    @Query(value = "CALL historial_por_usuario(:id_usuario)", nativeQuery = true)
    List<Object[]> getHistorialPorUsuario(@Param("id_usuario") Long id_usuario);
}
