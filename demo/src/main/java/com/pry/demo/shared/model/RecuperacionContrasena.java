package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "recuperacion_contrasena")
public class RecuperacionContrasena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_recuperacion;
    private Long id_usuario;
    private String token;
    private Timestamp expira_en;
    private boolean usado;
    private Timestamp fecha_creacion;

    public RecuperacionContrasena() {}

    public RecuperacionContrasena(Long id_usuario, String token, Timestamp expira_en) {
        this.id_usuario = id_usuario;
        this.token = token;
        this.expira_en = expira_en;
        this.usado = false;
        this.fecha_creacion = new Timestamp(System.currentTimeMillis());
    }

    public Long getId_recuperacion() {
        return id_recuperacion;
    }

    public void setId_recuperacion(Long id_recuperacion) {
        this.id_recuperacion = id_recuperacion;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Timestamp getExpira_en() {
        return expira_en;
    }

    public void setExpira_en(Timestamp expira_en) {
        this.expira_en = expira_en;
    }

    public boolean isUsado() {
        return usado;
    }

    public void setUsado(boolean usado) {
        this.usado = usado;
    }

    public Timestamp getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(Timestamp fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }
}
