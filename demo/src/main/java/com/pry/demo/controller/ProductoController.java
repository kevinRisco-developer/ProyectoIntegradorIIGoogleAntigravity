package com.pry.demo.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Producto;
import com.pry.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/producto")
@CrossOrigin(origins = "*")
public class ProductoController {
    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping("/destacados")
    public List<com.pry.demo.dto.ProductoVendidoDTO> getDestacados() {
        List<Object[]> results = productoRepository.getProductosMasVendidos();
        
        // Fallback: Si no hay ventas, devolver productos genéricos para que la UI no se vea vacía
        if (results == null || results.isEmpty()) {
            return productoRepository.findAll().stream()
                .limit(10)
                .map(p -> new com.pry.demo.dto.ProductoVendidoDTO(
                    p.getId_producto(),
                    p.getNombre(),
                    p.getDescripcion(),
                    p.getPrecio(),
                    p.getImagen_url(),
                    0L // 0 ventas para productos de fallback
                )).collect(java.util.stream.Collectors.toList());
        }

        return results.stream().map(result -> {
            try {
                Long id = Long.valueOf(result[0].toString());
                String nombre = result[1].toString();
                String descripcion = (result.length > 2 && result[2] != null) ? result[2].toString() : "";
                Double precio = (result.length > 3) ? Double.valueOf(result[3].toString()) : 0.0;
                String imagenUrl = (result.length > 4 && result[4] != null) ? result[4].toString() : "";
                Long ventas = (result.length > 5) ? Long.valueOf(result[5].toString()) : 0L;

                return new com.pry.demo.dto.ProductoVendidoDTO(id, nombre, descripcion, precio, imagenUrl, ventas);
            } catch (Exception e) {
                System.err.println("Error mapeando producto destacado: " + e.getMessage());
                return null;
            }
        }).filter(java.util.Objects::nonNull)
          .collect(java.util.stream.Collectors.toList());
    }



    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Producto getProductoById(@PathVariable Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto not found with id " + id));
    }


    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto not found with id " + id));
        productoRepository.delete(producto);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Producto deleted successfully");
        return org.springframework.http.ResponseEntity.ok(response);
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Producto updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto not found with id " + id));
        producto.setNombre(productoDetails.getNombre());
        producto.setDescripcion(productoDetails.getDescripcion());
        producto.setPrecio(productoDetails.getPrecio());
        producto.setStock(productoDetails.getStock());
        producto.setId_categoria(productoDetails.getId_categoria());
        producto.setImagen_url(productoDetails.getImagen_url());
        producto.setEstado(productoDetails.getEstado());
        return productoRepository.save(producto);
    }
}
