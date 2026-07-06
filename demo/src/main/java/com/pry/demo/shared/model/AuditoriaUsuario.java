package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auditoria_usuario")
public class AuditoriaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_auditoria_usuario;
    private String nombre;
    private String email;
    private String password;
    private boolean is_mfa_enabled;
    private String totp_secret;
    private Long id_usuario;
    private Long id_admin;
    private String accion;
    private Timestamp fecha;

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public Timestamp getFecha() { return fecha; }
    public void setFecha(Timestamp fecha) { this.fecha = fecha; }

    public Long getId_auditoria_usuario() {
        return id_auditoria_usuario;
    }

    public void setId_auditoria_usuario(Long id_auditoria_usuario) {
        this.id_auditoria_usuario = id_auditoria_usuario;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isIs_mfa_enabled() {
        return is_mfa_enabled;
    }

    public void setIs_mfa_enabled(boolean is_mfa_enabled) {
        this.is_mfa_enabled = is_mfa_enabled;
    }

    public String getTotp_secret() {
        return totp_secret;
    }

    public void setTotp_secret(String totp_secret) {
        this.totp_secret = totp_secret;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId_admin() {
        return id_admin;
    }

    public void setId_admin(Long id_admin) {
        this.id_admin = id_admin;
    }
}
