package com.pry.demo.modulo_recomendacion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** Ítem de recomendación devuelto por el servicio FastAPI. */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecomendacionItemDTO {
    private Long id_producto;
    private String nombre;
    private String marca;
    private Integer id_categoria;
    private Double precio;
    private Double score;
    private String origen;

    public Long getId_producto() { return id_producto; }
    public void setId_producto(Long id_producto) { this.id_producto = id_producto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public Integer getId_categoria() { return id_categoria; }
    public void setId_categoria(Integer id_categoria) { this.id_categoria = id_categoria; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }
}
