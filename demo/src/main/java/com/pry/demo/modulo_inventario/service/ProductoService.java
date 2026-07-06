package com.pry.demo.modulo_inventario.service;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.AuditoriaProducto;
import com.pry.demo.shared.repository.ProductoRepository;
import com.pry.demo.shared.repository.AuditoriaProductoRepository;
import com.pry.demo.modulo_inventario.dto.ProductoCategoriaDTO;
import com.pry.demo.modulo_inventario.dto.ProductoDetalleDTO;
import com.pry.demo.modulo_inventario.dto.ProductoVendidoDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

    @PersistenceContext
    private EntityManager entityManager;

    // ============================================================
    // Métodos para INVENTARIO (admin)
    // ============================================================

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public List<ProductoCategoriaDTO> getProductosConCategoria() {
        List<Object[]> results = productoRepository.getProductosConCategoria();
        if (results == null) return new ArrayList<>();

        return results.stream().map(result -> {
            try {
                // Procedure columns (after adding marca to producto):
                // [0] id_producto, [1] nombre, [2] descripcion, [3] precio, [4] stock
                // [5] id_categoria, [6] imagen_url, [7] estado(bool), [8] descuento, [9] marca
                // [10] id_categoria(cat), [11] nombre(cat), [12] estado(cat,bool)
                Long id = Long.valueOf(result[0].toString());
                String nombre = result[1] != null ? result[1].toString() : "";
                String descripcion = result[2] != null ? result[2].toString() : "";
                double precio = result[3] != null ? Double.parseDouble(result[3].toString()) : 0.0;
                int stock = result[4] != null ? Integer.parseInt(result[4].toString()) : 0;
                int idCat = result[5] != null ? Integer.parseInt(result[5].toString()) : 0;
                String img = result[6] != null ? result[6].toString() : "";
                int estado = result[7] != null ? parseBoolOrInt(result[7].toString()) : 1;
                double descuento = result[8] != null ? Double.parseDouble(result[8].toString()) : 0.0;
                String marca = result[9] != null ? result[9].toString() : "";
                String catNombre = result[11] != null ? result[11].toString() : "";
                int catEstado = result[12] != null ? parseBoolOrInt(result[12].toString()) : 1;

                return new ProductoCategoriaDTO(id, nombre, descripcion, precio, stock, idCat, img, estado, descuento, marca, catNombre, catEstado);
            } catch (Exception e) {
                System.err.println("Error mapping product category row: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    /** Convierte "true"/"false" (JDBC boolean) o "1"/"0" a int. */
    private int parseBoolOrInt(String val) {
        if ("true".equalsIgnoreCase(val)) return 1;
        if ("false".equalsIgnoreCase(val)) return 0;
        return Integer.parseInt(val);
    }

    public Producto getProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));
    }

    @Transactional
    public void deleteProducto(Long id, Long idAlmacenero) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));

        // Baja lógica: estado = 0
        entityManager.createNativeQuery("SET @id_almacenero = :id")
                .setParameter("id", idAlmacenero)
                .executeUpdate();
        producto.setEstado(0);
        productoRepository.save(producto);
    }

    public Producto createProducto(Producto producto) {
        if (producto.getEstado() == 0) {
            producto.setEstado(1); // Activo por defecto
        }
        return productoRepository.save(producto);
    }

    /**
     * Actualiza el producto. Registra @id_almacenero en la sesión MySQL
     * para que el trigger trg_producto_before_update lo capture en auditoria_producto.
     */
    @Transactional
    public Producto updateProducto(Long id, Producto details, Long idAlmacenero) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));

        // Registrar el almacenero en la sesión antes de actualizar
        entityManager.createNativeQuery("SET @id_almacenero = :id")
                .setParameter("id", idAlmacenero)
                .executeUpdate();

        // Update product → dispara trg_producto_before_update
        producto.setNombre(details.getNombre());
        producto.setDescripcion(details.getDescripcion());
        producto.setPrecio(details.getPrecio());
        producto.setStock(details.getStock());
        producto.setId_categoria(details.getId_categoria());
        producto.setImagen_url(details.getImagen_url());
        producto.setEstado(details.getEstado());
        producto.setDescuento(details.getDescuento());
        producto.setMarca(details.getMarca());

        return productoRepository.save(producto);
    }

    // ============================================================
    // Métodos públicos para CLIENTE (paginados)
    // ============================================================

    /** Listado público paginado de productos activos. */
    public Page<Producto> getProductosActivos(Pageable pageable) {
        return productoRepository.findByEstado(1, pageable);
    }

    /** Filtro público por categoría, paginado. */
    public Page<Producto> getProductosPorCategoriaPublic(int idCategoria, Pageable pageable) {
        return productoRepository.findByIdCategoriaAndEstado(idCategoria, 1, pageable);
    }

    /** Búsqueda FULLTEXT paginada usando MATCH...AGAINST en modo BOOLEAN. */
    public Page<Producto> searchProductos(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return productoRepository.findByEstado(1, pageable);
        }
        // Formatear el término para búsqueda booleana (agrega * al final para prefijo)
        String termino = query.trim() + "*";
        return productoRepository.searchByNameFulltext(termino, pageable);
    }

    /** Detalle de producto con campos calculados de disponibilidad. */
    public ProductoDetalleDTO getProductoDetalle(Long id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + id));

        String disponibilidad = p.getStock() > 0 ? "En Stock" : "Agotado";
        return new ProductoDetalleDTO(
                p.getId_producto(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getStock(),
                p.getId_categoria(),
                p.getImagen_url(),
                p.getEstado(),
                p.getDescuento(),
                disponibilidad
        );
    }

    // ============================================================
    // Métodos auxiliares
    // ============================================================

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
