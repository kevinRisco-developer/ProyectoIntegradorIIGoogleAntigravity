package com.pry.demo.shared.model;

import java.sql.Timestamp;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auditoria_producto")
public class AuditoriaProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_auditoria_producto;
    private Long id_producto;
    private Timestamp fecha_modificacion;
    private double precio_pasado;
    private double precio_modificado;
    private Long id_almacenero;
    private String accion;
    private Integer stock_anterior;
    private Integer stock_modificado;

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public Integer getStock_anterior() { return stock_anterior; }
    public void setStock_anterior(Integer stock_anterior) { this.stock_anterior = stock_anterior; }

    public Integer getStock_modificado() { return stock_modificado; }
    public void setStock_modificado(Integer stock_modificado) { this.stock_modificado = stock_modificado; }

    public Long getId_auditoria_producto() {
        return id_auditoria_producto;
    }

    public void setId_auditoria_producto(Long id_auditoria_producto) {
        this.id_auditoria_producto = id_auditoria_producto;
    }

    public Long getId_producto() {
        return id_producto;
    }

    public void setId_producto(Long id_producto) {
        this.id_producto = id_producto;
    }

    public Timestamp getFecha_modificacion() {
        return fecha_modificacion;
    }

    public void setFecha_modificacion(Timestamp fecha_modificacion) {
        this.fecha_modificacion = fecha_modificacion;
    }

    public double getPrecio_pasado() {
        return precio_pasado;
    }

    public void setPrecio_pasado(double precio_pasado) {
        this.precio_pasado = precio_pasado;
    }

    public double getPrecio_modificado() {
        return precio_modificado;
    }

    public void setPrecio_modificado(double precio_modificado) {
        this.precio_modificado = precio_modificado;
    }

    public Long getId_almacenero() {
        return id_almacenero;
    }

    public void setId_almacenero(Long id_almacenero) {
        this.id_almacenero = id_almacenero;
    }
}
