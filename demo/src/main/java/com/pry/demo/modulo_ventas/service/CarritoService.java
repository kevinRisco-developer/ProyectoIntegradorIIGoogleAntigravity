package com.pry.demo.modulo_ventas.service;

import com.pry.demo.shared.model.Carrito;
import com.pry.demo.shared.model.Carrito_detalle;
import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.CarritoRepository;
import com.pry.demo.shared.repository.Carrito_detalleRepository;
import com.pry.demo.shared.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private Carrito_detalleRepository detalleRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Valida que la cantidad solicitada no exceda el stock disponible del producto (HU-10/11).
     * Lanza IllegalArgumentException si el producto no existe o no hay stock suficiente.
     */
    private void validarStock(Long idProducto, int cantidadSolicitada) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new IllegalArgumentException("El producto no existe"));
        if (producto.getEstado() == 0) {
            throw new IllegalArgumentException("El producto no está disponible");
        }
        if (cantidadSolicitada > producto.getStock()) {
            throw new IllegalArgumentException(
                    "Stock insuficiente para \"" + producto.getNombre() + "\". Disponible: " + producto.getStock());
        }
    }

    public Carrito getOrCreateCarrito(Usuario user) {
        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito == null) {
            carrito = new Carrito();
            carrito.setId_usuario(user.getId_usuario());
            carrito.setFecha_creacion(new Timestamp(System.currentTimeMillis()));
            carrito = carritoRepository.save(carrito);
        }
        return carrito;
    }

    public List<Carrito_detalle> getCarritoDetalles(Usuario user) {
        Carrito carrito = getOrCreateCarrito(user);
        return detalleRepository.findById_carrito(carrito.getId_carrito());
    }

    @Transactional
    public void addItem(Usuario user, Carrito_detalle item) {
        Carrito carrito = getOrCreateCarrito(user);

        List<Carrito_detalle> actuales = detalleRepository.findById_carrito(carrito.getId_carrito());
        Optional<Carrito_detalle> existente = actuales.stream()
                .filter(d -> d.getId_producto().equals(item.getId_producto()))
                .findFirst();

        int cantidadActual = existente.map(Carrito_detalle::getCantidad).orElse(0);
        // Valida stock contra la cantidad TOTAL que quedaría en el carrito.
        validarStock(item.getId_producto(), cantidadActual + item.getCantidad());

        if (existente.isPresent()) {
            Carrito_detalle d = existente.get();
            d.setCantidad(cantidadActual + item.getCantidad());
            detalleRepository.save(d);
        } else {
            item.setId_carrito(carrito.getId_carrito());
            detalleRepository.save(item);
        }
    }

    @Transactional
    public void syncCarrito(Usuario user, List<Carrito_detalle> items) {
        Carrito carrito = getOrCreateCarrito(user);

        for (Carrito_detalle item : items) {
            List<Carrito_detalle> actuales = detalleRepository.findById_carrito(carrito.getId_carrito());
            Optional<Carrito_detalle> existente = actuales.stream()
                    .filter(d -> d.getId_producto().equals(item.getId_producto()))
                    .findFirst();

            if (existente.isPresent()) {
                Carrito_detalle d = existente.get();
                d.setCantidad(d.getCantidad() + item.getCantidad());
                detalleRepository.save(d);
            } else {
                item.setId_carrito(carrito.getId_carrito());
                item.setId_detalle(null); // Ensure it creates a new row
                detalleRepository.save(item);
            }
        }
    }

    @Transactional
    public void removeItem(Usuario user, Long idProducto) {
        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito != null) {
            List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
            detalles.stream()
                    .filter(d -> d.getId_producto().equals(idProducto))
                    .findFirst()
                    .ifPresent(d -> detalleRepository.delete(d));
        }
    }

    @Transactional
    public void updateItemCantidad(Usuario user, Long idProducto, int cantidad) {
        Carrito carrito = getOrCreateCarrito(user);
        List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
        Optional<Carrito_detalle> itemOpt = detalles.stream()
                .filter(d -> d.getId_producto().equals(idProducto))
                .findFirst();

        if (itemOpt.isPresent()) {
            Carrito_detalle item = itemOpt.get();
            if (cantidad <= 0) {
                detalleRepository.delete(item);
            } else {
                validarStock(idProducto, cantidad);
                item.setCantidad(cantidad);
                detalleRepository.save(item);
            }
        } else {
            if (cantidad > 0) {
                validarStock(idProducto, cantidad);
                Carrito_detalle item = new Carrito_detalle();
                item.setId_carrito(carrito.getId_carrito());
                item.setId_producto(idProducto);
                item.setCantidad(cantidad);
                detalleRepository.save(item);
            }
        }
    }

    @Transactional
    public void clearCarrito(Usuario user) {
        Carrito carrito = carritoRepository.findById_usuario(user.getId_usuario());
        if (carrito != null) {
            List<Carrito_detalle> detalles = detalleRepository.findById_carrito(carrito.getId_carrito());
            detalleRepository.deleteAll(detalles);
        }
    }
}
