package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.AuditoriaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface AuditoriaUsuarioRepository extends JpaRepository<AuditoriaUsuario, Long> {

    // Filtro por rango de fechas, responsable (id_admin) y tipo de acción. Params opcionales (NULL = ignorar).
    @Query("SELECT a FROM AuditoriaUsuario a WHERE " +
            "(:desde IS NULL OR a.fecha >= :desde) AND (:hasta IS NULL OR a.fecha <= :hasta) AND " +
            "(:responsable IS NULL OR a.id_admin = :responsable) AND " +
            "(:accion IS NULL OR a.accion = :accion) " +
            "ORDER BY a.fecha DESC, a.id_auditoria_usuario DESC")
    List<AuditoriaUsuario> filtrar(@Param("desde") Timestamp desde, @Param("hasta") Timestamp hasta,
                                   @Param("responsable") Long responsable, @Param("accion") String accion);
}
