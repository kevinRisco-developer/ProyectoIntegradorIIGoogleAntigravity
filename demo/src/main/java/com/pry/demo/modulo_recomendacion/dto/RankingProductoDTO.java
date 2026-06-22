package com.pry.demo.modulo_recomendacion.dto;

/**
 * DTO para representar un producto con su puntuación de ranking.
 */
public class RankingProductoDTO {

    private Long idProducto;
    private String nombre;
    private double precio;
    private String imagenUrl;
    private int stock;
    private double score; // Puntuación de relevancia del sistema de IA

    public RankingProductoDTO() {}

    public RankingProductoDTO(Long idProducto, String nombre, double precio,
                               String imagenUrl, int stock, double score) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.stock = stock;
        this.score = score;
    }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
}
