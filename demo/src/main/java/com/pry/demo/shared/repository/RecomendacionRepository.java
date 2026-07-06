package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.pry.demo.shared.model.Recomendacion;

public interface RecomendacionRepository extends JpaRepository<Recomendacion, Long> {

    // Consultas explícitas para evitar la ambigüedad de Spring Data con el
    // campo `id_usuario` (guion bajo).

    @Query("select r from Recomendacion r where r.id_usuario = :uid order by r.score desc")
    List<Recomendacion> findByUsuario(@Param("uid") Long uid);

    @Modifying
    @Query("delete from Recomendacion r where r.id_usuario = :uid")
    void deleteByUsuario(@Param("uid") Long uid);
}
