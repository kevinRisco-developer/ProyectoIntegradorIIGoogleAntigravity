package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auditoria_categoria")
public class AuditoriaCategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_auditoria_categoria;
    private Long id_categoria;
    private String nombre;
    private Timestamp fecha_actualizacion;
    private Long id_almacenero;

    public Long getId_auditoria_categoria() {
        return id_auditoria_categoria;
    }

    public void setId_auditoria_categoria(Long id_auditoria_categoria) {
        this.id_auditoria_categoria = id_auditoria_categoria;
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

    public Timestamp getFecha_actualizacion() {
        return fecha_actualizacion;
    }

    public void setFecha_actualizacion(Timestamp fecha_actualizacion) {
        this.fecha_actualizacion = fecha_actualizacion;
    }

    public Long getId_almacenero() {
        return id_almacenero;
    }

    public void setId_almacenero(Long id_almacenero) {
        this.id_almacenero = id_almacenero;
    }
}
