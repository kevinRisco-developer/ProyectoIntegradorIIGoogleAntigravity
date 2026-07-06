package com.pry.demo.shared.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "usuario_rol")
public class Usuario_rol implements Persistable<Long> {
    // id_usuario es la identidad del mapeo (un rol por usuario). NO es autogenerado:
    // el valor se asigna con el id del usuario. La tabla real tiene PK compuesta
    // (id_usuario, id_rol) sin auto-incremento.
    @Id
    private Long id_usuario;
    private Long id_rol;

    // Marca de entidad nueva para que save() ejecute INSERT (persist) en vez de
    // UPDATE (merge) cuando el id ya viene asignado. Se desactiva al cargar/persistir.
    @Transient
    private boolean nuevo = true;

    @Override
    public Long getId() {
        return id_usuario;
    }

    @Override
    public boolean isNew() {
        return nuevo;
    }

    @PostLoad
    @PostPersist
    void marcarExistente() {
        this.nuevo = false;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Long getId_rol() {
        return id_rol;
    }

    public void setId_rol(Long id_rol) {
        this.id_rol = id_rol;
    }
}
