package com.pry.demo.modulo_recomendacion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/** Respuesta del endpoint FastAPI GET /recomendar/{user_id}. */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecomendarResponseDTO {
    private Long id_usuario;
    private Integer total;
    private String entrenado_en;
    private List<RecomendacionItemDTO> recomendaciones;

    public Long getId_usuario() { return id_usuario; }
    public void setId_usuario(Long id_usuario) { this.id_usuario = id_usuario; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public String getEntrenado_en() { return entrenado_en; }
    public void setEntrenado_en(String entrenado_en) { this.entrenado_en = entrenado_en; }

    public List<RecomendacionItemDTO> getRecomendaciones() { return recomendaciones; }
    public void setRecomendaciones(List<RecomendacionItemDTO> recomendaciones) { this.recomendaciones = recomendaciones; }
}
