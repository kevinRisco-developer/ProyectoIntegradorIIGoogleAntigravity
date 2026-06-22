package com.pry.demo.modulo_ventas.controller;

import com.pry.demo.shared.model.Pago;
import com.pry.demo.shared.repository.PagoRepository;
import com.pry.demo.modulo_ventas.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pago")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Autowired
    private PagoRepository pagoRepository;

    /**
     * Procesar pago simulado para un pedido dado.
     * Body: { "idPedido": 1, "monto": 150.0, "metodo": "TARJETA" }
     */
    @PostMapping("/procesar")
    public ResponseEntity<?> procesarPago(@RequestBody Map<String, Object> request) {
        try {
            Long idPedido = Long.valueOf(request.get("idPedido").toString());
            double monto = Double.parseDouble(request.get("monto").toString());
            String metodo = request.get("metodo").toString();

            Pago pago = pagoService.procesarPagoSimulado(idPedido, monto, metodo);
            return ResponseEntity.ok(pago);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error procesando pago: " + e.getMessage());
        }
    }

    /**
     * Obtener pago por ID de pedido.
     */
    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<?> getPagoByPedido(@PathVariable Long idPedido) {
        Pago pago = pagoRepository.findById_pedido(idPedido);
        if (pago == null) {
            return ResponseEntity.status(404).body("Pago no encontrado para el pedido: " + idPedido);
        }
        return ResponseEntity.ok(pago);
    }

    /**
     * Listar todos los pagos (solo ADMIN).
     */
    @GetMapping
    public ResponseEntity<List<Pago>> getAllPagos() {
        return ResponseEntity.ok(pagoRepository.findAll());
    }
}
