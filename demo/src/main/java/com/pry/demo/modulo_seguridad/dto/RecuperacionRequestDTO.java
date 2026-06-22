package com.pry.demo.modulo_seguridad.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RecuperacionRequestDTO {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
