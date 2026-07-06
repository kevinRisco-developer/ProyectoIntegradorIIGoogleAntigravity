package com.pry.demo.modulo_resenas.dto;

import java.sql.Timestamp;

public class ResenaDTO {
    private Long id_resena;
    private Long id_usuario;
    private String nombre_usuario;
    private Long id_producto;
    private int calificacion;
    private String comentario;
    private Timestamp fecha;

    public ResenaDTO() {}

    public ResenaDTO(Long id_resena, Long id_usuario, String nombre_usuario, Long id_producto,
                     int calificacion, String comentario, Timestamp fecha) {
        this.id_resena = id_resena;
        this.id_usuario = id_usuario;
        this.nombre_usuario = nombre_usuario;
        this.id_producto = id_producto;
        this.calificacion = calificacion;
        this.comentario = comentario;
        this.fecha = fecha;
    }

    public Long getId_resena() { return id_resena; }
    public void setId_resena(Long id_resena) { this.id_resena = id_resena; }

    public Long getId_usuario() { return id_usuario; }
    public void setId_usuario(Long id_usuario) { this.id_usuario = id_usuario; }

    public String getNombre_usuario() { return nombre_usuario; }
    public void setNombre_usuario(String nombre_usuario) { this.nombre_usuario = nombre_usuario; }

    public Long getId_producto() { return id_producto; }
    public void setId_producto(Long id_producto) { this.id_producto = id_producto; }

    public int getCalificacion() { return calificacion; }
    public void setCalificacion(int calificacion) { this.calificacion = calificacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Timestamp getFecha() { return fecha; }
    public void setFecha(Timestamp fecha) { this.fecha = fecha; }
}
