package com.pry.demo.shared.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mfa")
public class Mfa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_mfa;
    private Long id_usuario;
    private String secreto;
    private int habilitado;

    public Long getId_mfa() {
        return id_mfa;
    }

    public void setId_mfa(Long id_mfa) {
        this.id_mfa = id_mfa;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getSecreto() {
        return secreto;
    }

    public void setSecreto(String secreto) {
        this.secreto = secreto;
    }

    public int getHabilitado() {
        return habilitado;
    }

    public void setHabilitado(int habilitado) {
        this.habilitado = habilitado;
    }
}
