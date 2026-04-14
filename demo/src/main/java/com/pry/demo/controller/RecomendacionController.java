package com.pry.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.Arrays;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.pry.demo.model.Recomendacion;
import com.pry.demo.repository.RecomendacionRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/recomendacion")
public class RecomendacionController {
    
    @Autowired private RecomendacionRepository recomendacionRepository;
    @Autowired private com.pry.demo.repository.ProductoRepository productoRepository;
    @Autowired private com.pry.demo.repository.UsuarioRepository usuarioRepository;
    @Autowired private org.springframework.web.client.RestTemplate restTemplate;
    @Autowired private com.pry.demo.service.RecomendacionService recomendacionService;
    @Autowired private com.pry.demo.service.EmailService emailService;

    private String getAuthenticatedEmail() {
        return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/smart")
    public List<com.pry.demo.model.Producto> getSmartRecommendations() {
        String email = getAuthenticatedEmail();
        com.pry.demo.model.Usuario user = usuarioRepository.findByEmail(email);
        return recomendacionService.getProductsForUser(user);
    }

    @Autowired private com.pry.demo.service.MarketingScheduler marketingScheduler;

    @PostMapping("/test-batch-email")
    public String triggerTestBatch() {
        marketingScheduler.triggerManualBatch();
        return "Proceso de envío masivo iniciado (Ver logs de consola)";
    }

    @PostMapping("/send-offers")
    public String sendSmartOffers() {
        String email = getAuthenticatedEmail();
        com.pry.demo.model.Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) return "Usuario no encontrado";

        List<com.pry.demo.model.Producto> recs = recomendacionService.getProductsForUser(user);
        if (!recs.isEmpty()) {
            emailService.sendPersonalizedOffers(user, recs);
            return "Ofertas enviadas exitosamente";
        }
        return "No hay recomendaciones para enviar";
    }

    @GetMapping
    public List<Recomendacion> getAllRecomendaciones() {
        return recomendacionRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteRecomendacion(@PathVariable Long id) {
        Recomendacion recomendacion = recomendacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recomendacion not found with id " + id));
        recomendacionRepository.delete(recomendacion);
        return "Recomendacion deleted successfully with id " + id;
    }

    @PostMapping
    public Recomendacion createRecomendacion(@RequestBody Recomendacion recomendacion) {
        return recomendacionRepository.save(recomendacion);
    }

    @PutMapping("/{id}")
    public Recomendacion updateRecomendacion(@PathVariable Long id, @RequestBody Recomendacion recomendacionDetails) {
        Recomendacion recomendacion = recomendacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recomendacion not found with id " + id));
        recomendacion.setScore(recomendacionDetails.getScore());
        recomendacion.setFecha(recomendacionDetails.getFecha());
        return recomendacionRepository.save(recomendacion);
    }
}
