package com.pry.demo.modulo_ventas.dto;

import jakarta.validation.constraints.NotBlank;

public class PedidoRequestDTO {
    @NotBlank(message = "El nombre completo es requerido")
    private String nombreCompleto;

    @NotBlank(message = "La dirección de envío es requerida")
    private String direccionEnvio;

    @NotBlank(message = "El teléfono es requerido")
    private String telefono;

    @NotBlank(message = "El método de pago es requerido")
    private String metodoPago;

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
