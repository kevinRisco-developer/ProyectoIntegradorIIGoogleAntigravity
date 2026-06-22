package com.pry.demo.modulo_usuarios.dto;

import java.sql.Timestamp;

public class UsuarioDTO {
    private Long id_usuario;
    private String nombre;
    private String email;
    private int estado;
    private Timestamp fecha_registro;
    private boolean isMfaEnabled;
    private String role;

    public UsuarioDTO() {}

    public UsuarioDTO(Long id_usuario, String nombre, String email, int estado, Timestamp fecha_registro, boolean isMfaEnabled, String role) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.email = email;
        this.estado = estado;
        this.fecha_registro = fecha_registro;
        this.isMfaEnabled = isMfaEnabled;
        this.role = role;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public Timestamp getFecha_registro() {
        return fecha_registro;
    }

    public void setFecha_registro(Timestamp fecha_registro) {
        this.fecha_registro = fecha_registro;
    }

    public boolean isMfaEnabled() {
        return isMfaEnabled;
    }

    public void setMfaEnabled(boolean mfaEnabled) {
        this.isMfaEnabled = mfaEnabled;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
