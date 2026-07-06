package com.pry.demo.modulo_recomendacion.service;

import com.pry.demo.modulo_recomendacion.dto.RecomendacionItemDTO;
import com.pry.demo.modulo_recomendacion.dto.RecomendarResponseDTO;
import com.pry.demo.shared.model.Producto;
import com.pry.demo.shared.model.Recomendacion;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.ProductoRepository;
import com.pry.demo.shared.repository.RecomendacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Servicio de recomendaciones (HU-15).
 * Consume el microservicio FastAPI vía WebClient y persiste el resultado en la
 * tabla `recomendacion` para el usuario.
 */
@Service
public class RecomendacionService {

    private static final int LIMIT_DEFAULT = 8;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private RecomendacionRepository recomendacionRepository;

    @Autowired
    private WebClient aiWebClient;

    /**
     * Recomendaciones para el usuario autenticado: llama a la IA, persiste en
     * `recomendacion` y devuelve los productos en orden de score.
     */
    @Transactional
    public List<Producto> getProductsForUser(Usuario user) {
        Long userId = (user != null) ? user.getId_usuario() : 0L;

        try {
            RecomendarResponseDTO resp = aiWebClient.get()
                    .uri(uri -> uri.path("/recomendar/{id}")
                            .queryParam("limit", LIMIT_DEFAULT)
                            .build(userId))
                    .retrieve()
                    .bodyToMono(RecomendarResponseDTO.class)
                    .block();

            if (resp != null && resp.getRecomendaciones() != null && !resp.getRecomendaciones().isEmpty()) {
                List<RecomendacionItemDTO> items = resp.getRecomendaciones();

                // Persistir solo para usuarios reales (no para el anónimo id=0).
                if (user != null) {
                    persistirRecomendaciones(userId, items);
                }

                List<Long> ids = items.stream()
                        .map(RecomendacionItemDTO::getId_producto)
                        .filter(Objects::nonNull)
                        .toList();
                return ordenarPorIds(ids);
            }
        } catch (Exception e) {
            System.err.println("Error consumiendo la IA (WebClient) para usuario " + userId + ": " + e.getMessage());
        }

        // Fallback: primeros productos si la IA falla.
        return productoRepository.findAll().stream().limit(LIMIT_DEFAULT).toList();
    }

    /** Recomendaciones públicas (visitante anónimo): popularidad, sin persistir. */
    public List<Producto> getPublicProducts() {
        return getProductsForUser(null);
    }

    /**
     * Reemplaza las recomendaciones previas del usuario por las nuevas.
     */
    private void persistirRecomendaciones(Long userId, List<RecomendacionItemDTO> items) {
        recomendacionRepository.deleteByUsuario(userId);
        Timestamp ahora = new Timestamp(System.currentTimeMillis());
        for (RecomendacionItemDTO item : items) {
            if (item.getId_producto() == null) continue;
            Recomendacion r = new Recomendacion();
            r.setId_usuario(userId);
            r.setId_producto(item.getId_producto());
            r.setScore(item.getScore() != null ? item.getScore() : 0.0);
            r.setFecha(ahora);
            recomendacionRepository.save(r);
        }
    }

    /** Trae los productos por id y los devuelve en el mismo orden de la lista. */
    private List<Producto> ordenarPorIds(List<Long> ids) {
        Map<Long, Producto> porId = productoRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Producto::getId_producto, Function.identity()));
        return ids.stream()
                .map(porId::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
