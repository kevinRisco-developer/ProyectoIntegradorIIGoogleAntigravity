package com.pry.demo.modulo_inventario.dto;

public class CategoriaDTO {
    private Long id_categoria;
    private String nombre;
    private int estado;

    public CategoriaDTO() {}

    public CategoriaDTO(Long id_categoria, String nombre, int estado) {
        this.id_categoria = id_categoria;
        this.nombre = nombre;
        this.estado = estado;
    }

    public Long getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(Long id_categoria) {
        this.id_categoria = id_categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }
}
