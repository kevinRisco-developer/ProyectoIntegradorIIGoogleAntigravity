package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Historial;
import com.pry.demo.repository.HistorialRepository;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/historial")
public class HistorialController {
    @Autowired
    private HistorialRepository historialRepository;

    @GetMapping
    public List<Historial> getAllHistoriales() {
        return historialRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteHistorial(@PathVariable Long id) {
        Historial historial = historialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historial con id: " + id + "no encontrado"));
        historialRepository.delete(historial);
        return "Historial eliminado con id: " + id;
    }

    @PostMapping
    public Historial createHistorial(@RequestBody Historial historial) {
        return historialRepository.save(historial);
    }

    @PutMapping("/{id}")
    public Historial updateHistorial(@PathVariable Long id, @RequestBody Historial historialDetails) {
        Historial historial = historialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historial con id: " + id + "no encontrado"));
        historial.setFecha(historialDetails.getFecha());
        historial.setAccion(historialDetails.getAccion());
        return historialRepository.save(historial);
    }
}
