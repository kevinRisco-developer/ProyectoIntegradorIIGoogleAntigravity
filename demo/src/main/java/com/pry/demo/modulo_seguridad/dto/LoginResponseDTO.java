package com.pry.demo.modulo_seguridad.dto;

public class LoginResponseDTO {
    private String token;
    private String role;
    private String name;
    private Long id_usuario;
    private boolean requireMfa;
    private String email;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, String role, String name, Long id_usuario, boolean requireMfa, String email) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.id_usuario = id_usuario;
        this.requireMfa = requireMfa;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public boolean isRequireMfa() {
        return requireMfa;
    }

    public void setRequireMfa(boolean requireMfa) {
        this.requireMfa = requireMfa;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
