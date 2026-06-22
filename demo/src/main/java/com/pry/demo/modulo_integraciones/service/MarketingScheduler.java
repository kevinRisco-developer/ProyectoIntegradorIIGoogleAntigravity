package com.pry.demo.modulo_integraciones.service;

import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import com.pry.demo.modulo_recomendacion.service.RecomendacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MarketingScheduler {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RecomendacionService recomendacionService;

    @Autowired
    private EmailService emailService;

    /**
     * Tarea programada semanalmente (Lunes a medianoche).
     * Cron: "0 0 0 ? * MON"
     * Seg Min Hora Dia Mes DiaSemana
     */
    @Scheduled(cron = "0 0 0 ? * MON")
    public void sendWeeklyRecommendations() {
        System.out.println("INICIO: Proceso semanal de marketing inteligente...");

        List<Usuario> activeUsers = usuarioRepository.findAll();
        int successCount = 0;

        for (Usuario user : activeUsers) {
            try {
                List<Producto> recs = recomendacionService.getProductsForUser(user);
                if (!recs.isEmpty()) {
                    emailService.sendPersonalizedOffers(user, recs);
                    successCount++;
                }
            } catch (Exception e) {
                System.err.println("Error procesando marketing para usuario " +
                        user.getId_usuario() + ": " + e.getMessage());
            }
        }

        System.out.println("FIN: Proceso semanal completado. Emails enviados: " + successCount);
    }

    /**
     * Método manual para disparar el proceso sin esperar al lunes (uso interno/test).
     */
    public void triggerManualBatch() {
        sendWeeklyRecommendations();
    }
}
