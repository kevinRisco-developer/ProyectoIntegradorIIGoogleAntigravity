package com.pry.demo.service;

import com.pry.demo.model.Pedido;
import com.pry.demo.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderTicket(Usuario user, Pedido pedido, List<Map<String, Object>> detalles) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Tu Comprobante de Compra - ImportSmart #" + pedido.getId_pedido());

        StringBuilder body = new StringBuilder();
        body.append("Hola ").append(user.getNombre()).append(",\n\n");
        body.append("Gracias por tu compra en ImportSmart. Aquí tienes el detalle de tu pedido:\n\n");
        body.append("Número de Pedido: ").append(pedido.getId_pedido()).append("\n");
        body.append("Fecha: ").append(pedido.getFecha()).append("\n");
        body.append("------------------------------------------\n");
        body.append("PRODUCTOS:\n");

        for (Map<String, Object> item : detalles) {
            body.append("- ").append(item.get("nombre_producto"))
                .append(" x").append(item.get("cantidad"))
                .append(": $").append(item.get("precio"))
                .append("\n");
        }

        body.append("------------------------------------------\n");
        body.append("TOTAL PAGADO: $").append(pedido.getTotal()).append("\n\n");
        body.append("Dirección de Envío: ").append(pedido.getDireccionEnvio()).append("\n");
        body.append("Método de Pago: ").append(pedido.getMetodoPago()).append("\n\n");
        body.append("¡Gracias por elegirnos!\n");
        body.append("Atentamente, El equipo de ImportSmart.");

        message.setText(body.toString());

        try {
            mailSender.send(message);
            System.out.println("Email enviado exitosamente a: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Error al enviar el email: " + e.getMessage());
        }
    }

    public void sendPersonalizedOffers(Usuario user, List<com.pry.demo.model.Producto> recommended) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("✨ Seleccionado para ti: Descubre tus ofertas de la semana");

        StringBuilder body = new StringBuilder();
        body.append("SMART SELECTION | IMPORTSMART\n");
        body.append("==========================================\n\n");
        body.append("Hola ").append(user.getNombre()).append(",\n\n");
        body.append("Nuestro sistema de Inteligencia Artificial ha analizado las últimas tendencias y tu actividad reciente para seleccionar estos productos exclusivos:\n\n");

        for (com.pry.demo.model.Producto prod : recommended) {
            body.append("➔ ").append(prod.getNombre().toUpperCase()).append("\n");
            body.append("   ").append(prod.getDescripcion()).append("\n");
            body.append("   PRECIO ESPECIAL: $").append(prod.getPrecio()).append("\n");
            body.append("   --------------------------------------\n\n");
        }

        body.append("¿Te interesa alguno? Haz clic aquí para ver más detalles: http://localhost:4200/home\n\n");
        body.append("Gracias por ser parte del futuro de las compras.\n");
        body.append("Atentamente,\n");
        body.append("Tu Asistente Virtual ImportSmart\n\n");
        body.append("==========================================\n");
        body.append("Has recibido este correo porque estás suscrito a nuestras Recomendaciones Semanales.");

        message.setText(body.toString());

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error al enviar email de marketing: " + e.getMessage());
        }
    }
}
