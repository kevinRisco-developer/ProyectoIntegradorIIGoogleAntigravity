package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.AuditoriaCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface AuditoriaCategoriaRepository extends JpaRepository<AuditoriaCategoria, Long> {

    // Filtro por rango de fechas, responsable (id_almacenero) y tipo de acción. Params opcionales.
    @Query("SELECT a FROM AuditoriaCategoria a WHERE " +
            "(:desde IS NULL OR a.fecha_actualizacion >= :desde) AND (:hasta IS NULL OR a.fecha_actualizacion <= :hasta) AND " +
            "(:responsable IS NULL OR a.id_almacenero = :responsable) AND " +
            "(:accion IS NULL OR a.accion = :accion) " +
            "ORDER BY a.fecha_actualizacion DESC, a.id_auditoria_categoria DESC")
    List<AuditoriaCategoria> filtrar(@Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                     @Param("responsable") Long responsable, @Param("accion") String accion);
}
