package com.pry.demo.modulo_inventario.dto;

public class ProductoVendidoDTO {
    private Long id_producto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen_url;
    private Long total_ventas;

    public ProductoVendidoDTO() {}

    public ProductoVendidoDTO(Long id_producto, String nombre, String descripcion, Double precio, String imagen_url, Long total_ventas) {
        this.id_producto = id_producto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen_url = imagen_url;
        this.total_ventas = total_ventas;
    }

    public Long getId_producto() {
        return id_producto;
    }

    public void setId_producto(Long id_producto) {
        this.id_producto = id_producto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getImagen_url() {
        return imagen_url;
    }

    public void setImagen_url(String imagen_url) {
        this.imagen_url = imagen_url;
    }

    public Long getTotal_ventas() {
        return total_ventas;
    }

    public void setTotal_ventas(Long total_ventas) {
        this.total_ventas = total_ventas;
    }
}
