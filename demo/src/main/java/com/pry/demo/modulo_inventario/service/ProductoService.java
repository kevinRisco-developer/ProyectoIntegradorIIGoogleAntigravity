package com.pry.demo.modulo_inventario.service;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.AuditoriaProducto;
import com.pry.demo.shared.repository.ProductoRepository;
import com.pry.demo.shared.repository.AuditoriaProductoRepository;
import com.pry.demo.modulo_inventario.dto.ProductoCategoriaDTO;
import com.pry.demo.modulo_inventario.dto.ProductoVendidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private AuditoriaProductoRepository auditoriaProductoRepository;

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public List<ProductoCategoriaDTO> getProductosConCategoria() {
        List<Object[]> results = productoRepository.getProductosConCategoria();
        if (results == null) return new ArrayList<>();

        return results.stream().map(result -> {
            try {
                Long id = Long.valueOf(result[0].toString());
                String nombre = result[1] != null ? result[1].toString() : "";
                String descripcion = result[2] != null ? result[2].toString() : "";
                double precio = result[3] != null ? Double.parseDouble(result[3].toString()) : 0.0;
                int stock = result[4] != null ? Integer.parseInt(result[4].toString()) : 0;
                int idCat = result[5] != null ? Integer.parseInt(result[5].toString()) : 0;
                String img = result[6] != null ? result[6].toString() : "";
                int estado = result[7] != null ? Integer.parseInt(result[7].toString()) : 1;
                String catNombre = result[8] != null ? result[8].toString() : "";
                int catEstado = result[9] != null ? Integer.parseInt(result[9].toString()) : 1;

                return new ProductoCategoriaDTO(id, nombre, descripcion, precio, stock, idCat, img, estado, catNombre, catEstado);
            } catch (Exception e) {
                System.err.println("Error mapping product category row: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public Producto getProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));
    }

    @Transactional
    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));
        productoRepository.delete(producto);
    }

    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto updateProducto(Long id, Producto details, Long idAlmacenero) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));

        // Create audit record
        AuditoriaProducto audit = new AuditoriaProducto();
        audit.setId_producto(producto.getId_producto());
        audit.setFecha_modificacion(new Timestamp(System.currentTimeMillis()));
        audit.setPrecio_pasado(producto.getPrecio());
        audit.setPrecio_modificado(details.getPrecio());
        audit.setId_almacenero(idAlmacenero);
        auditoriaProductoRepository.save(audit);

        // Update product
        producto.setNombre(details.getNombre());
        producto.setDescripcion(details.getDescripcion());
        producto.setPrecio(details.getPrecio());
        producto.setStock(details.getStock());
        producto.setId_categoria(details.getId_categoria());
        producto.setImagen_url(details.getImagen_url());
        producto.setEstado(details.getEstado());

        return productoRepository.save(producto);
    }

    public List<ProductoVendidoDTO> getProductosMasVendidos() {
        List<Object[]> results = productoRepository.getProductosMasVendidos();
        return mapToVendidoDTO(results);
    }

    public List<ProductoVendidoDTO> getTop5ProductosMasVendidos() {
        List<Object[]> results = productoRepository.getTop5ProductosMasVendidos();
        return mapToVendidoDTO(results);
    }

    public List<Producto> getProductosPorCategoria(int idCategoria) {
        return productoRepository.findAll().stream()
                .filter(p -> p.getId_categoria() == idCategoria)
                .collect(Collectors.toList());
    }

    private List<ProductoVendidoDTO> mapToVendidoDTO(List<Object[]> results) {
        if (results == null || results.isEmpty()) {
            return productoRepository.findAll().stream()
                .limit(10)
                .map(p -> new ProductoVendidoDTO(
                    p.getId_producto(),
                    p.getNombre(),
                    p.getDescripcion(),
                    p.getPrecio(),
                    p.getImagen_url(),
                    0L
                )).collect(Collectors.toList());
        }

        return results.stream().map(result -> {
            try {
                Long id = Long.valueOf(result[0].toString());
                String nombre = result[1].toString();
                String descripcion = (result.length > 2 && result[2] != null) ? result[2].toString() : "";
                Double precio = (result.length > 3) ? Double.valueOf(result[3].toString()) : 0.0;
                String imagenUrl = (result.length > 4 && result[4] != null) ? result[4].toString() : "";
                Long ventas = (result.length > 5) ? Long.valueOf(result[5].toString()) : 0L;

                return new ProductoVendidoDTO(id, nombre, descripcion, precio, imagenUrl, ventas);
            } catch (Exception e) {
                System.err.println("Error mapping sales: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }
}
