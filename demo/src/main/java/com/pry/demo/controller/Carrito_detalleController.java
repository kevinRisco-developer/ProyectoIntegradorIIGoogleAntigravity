package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.repository.Carrito_detalleRepository;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import com.pry.demo.model.Carrito_detalle;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/carrito_detalle")
public class Carrito_detalleController {
    @Autowired
    private Carrito_detalleRepository carrito_detalleRepository;

    @GetMapping
    public List<Carrito_detalle> getAllCarrito_detalle() {
        return carrito_detalleRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteCarrito_detalle(@PathVariable Long id) {
        Carrito_detalle carrito_detalle = carrito_detalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito_detalle not found with id " + id));
        carrito_detalleRepository.delete(carrito_detalle);
        return "Carrito_detalle deleted successfully with id " + id;
    }

    @PostMapping
    public Carrito_detalle createCarrito_detalle(@RequestBody Carrito_detalle carrito_detalle) {
        return carrito_detalleRepository.save(carrito_detalle);
    }

    @PutMapping("/{id}")
    public Carrito_detalle updateCarrito_detalle(@PathVariable Long id,
            @RequestBody Carrito_detalle carrito_detalleDetails) {
        Carrito_detalle carrito_detalle = carrito_detalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito_detalle not found with id " + id));
        carrito_detalle.setCantidad(carrito_detalleDetails.getCantidad());
        return carrito_detalleRepository.save(carrito_detalle);

    }
}
