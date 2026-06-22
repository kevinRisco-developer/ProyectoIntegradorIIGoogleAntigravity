package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "historial")
public class Historial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_historial;
    private Long id_usuario;
    private Long id_producto;
    private String accion;
    private Timestamp fecha;
    private Integer permanencia;

    public Long getId_historial() {
        return id_historial;
    }

    public void setId_historial(Long id_historial) {
        this.id_historial = id_historial;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId_producto() {
        return id_producto;
    }

    public void setId_producto(Long id_producto) {
        this.id_producto = id_producto;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public Integer getPermanencia() {
        return permanencia;
    }

    public void setPermanencia(Integer permanencia) {
        this.permanencia = permanencia;
    }
}
