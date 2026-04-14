package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Detalle_pedido;
import com.pry.demo.repository.Detalle_pedidoRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/detalle_pedido")
public class Detalle_pedidoController {
    @Autowired
    private Detalle_pedidoRepository detalle_pedidoRepository;

    @GetMapping
    public List<Detalle_pedido> getAllDetalle_pedido() {
        return detalle_pedidoRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteDetalle_pedido(@PathVariable Long id) {
        Detalle_pedido detalle_pedido = detalle_pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle_pedido not found with id " + id));
        detalle_pedidoRepository.delete(detalle_pedido);
        return "Detalle_pedido deleted successfully with id " + id;
    }

    @PostMapping
    public Detalle_pedido createDetalle_pedido(@RequestBody Detalle_pedido detalle_pedido) {
        return detalle_pedidoRepository.save(detalle_pedido);
    }

    @PutMapping("/{id}")
    public Detalle_pedido updateDetalle_pedido(@PathVariable Long id,
            @RequestBody Detalle_pedido detalle_pedidoDetails) {
        Detalle_pedido detalle_pedido = detalle_pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle_pedido not found with id " + id));
        detalle_pedido.setCantidad(detalle_pedidoDetails.getCantidad());
        detalle_pedido.setPrecio(detalle_pedidoDetails.getPrecio());
        return detalle_pedidoRepository.save(detalle_pedido);
    }

}
