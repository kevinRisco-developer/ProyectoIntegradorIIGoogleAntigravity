package com.pry.demo.modulo_ventas.service;

import com.pry.demo.shared.model.Pago;
import com.pry.demo.shared.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    public Pago procesarPagoSimulado(Long idPedido, double monto, String metodo) {
        Pago pago = new Pago();
        pago.setId_pedido(idPedido);
        pago.setMonto(monto);
        pago.setMetodo(metodo);
        pago.setEstado("APROBADO"); // Simulated payment is always approved
        pago.setFecha(new Timestamp(System.currentTimeMillis()));

        return pagoRepository.save(pago);
    }
}
