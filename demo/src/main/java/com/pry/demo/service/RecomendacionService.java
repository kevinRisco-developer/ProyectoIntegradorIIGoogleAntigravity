package com.pry.demo.service;

import com.pry.demo.model.Producto;
import com.pry.demo.model.Usuario;
import com.pry.demo.repository.ProductoRepository;
import com.pry.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class RecomendacionService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Obtiene recomendaciones dinámicas desde el microservicio de IA para un usuario específico.
     */
    public List<Producto> getProductsForUser(Usuario user) {
        Long userId = (user != null) ? user.getId_usuario() : 0L;
        String pythonUrl = "http://localhost:8000/recommend/" + userId;
        
        try {
            Long[] productIds = restTemplate.getForObject(pythonUrl, Long[].class);
            if (productIds != null && productIds.length > 0) {
                return productoRepository.findAllById(Arrays.asList(productIds));
            }
        } catch (Exception e) {
            System.err.println("Error llamando a la IA para usuario " + userId + ": " + e.getMessage());
        }

        // Fallback: Retornar los primeros 4 productos si la IA falla
        return productoRepository.findAll().stream().limit(4).toList();
    }
}
