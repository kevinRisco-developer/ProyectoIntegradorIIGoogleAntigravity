package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "backup_log")
public class BackupLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_backup_log;
    private String archivo;
    private String tipo;    // MANUAL | CRON
    private String estado;  // OK | ERROR
    private Long tamano_bytes;
    private Integer id_admin;
    private String mensaje;
    private Timestamp fecha;

    public BackupLog() {}

    public Long getId_backup_log() { return id_backup_log; }
    public void setId_backup_log(Long id_backup_log) { this.id_backup_log = id_backup_log; }

    public String getArchivo() { return archivo; }
    public void setArchivo(String archivo) { this.archivo = archivo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Long getTamano_bytes() { return tamano_bytes; }
    public void setTamano_bytes(Long tamano_bytes) { this.tamano_bytes = tamano_bytes; }

    public Integer getId_admin() { return id_admin; }
    public void setId_admin(Integer id_admin) { this.id_admin = id_admin; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public Timestamp getFecha() { return fecha; }
    public void setFecha(Timestamp fecha) { this.fecha = fecha; }
}
