package com.pry.demo.modulo_recomendacion.service;

import com.pry.demo.shared.model.Historial;
import com.pry.demo.shared.repository.HistorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

/**
 * Servicio de historial de comportamiento (Sprint IA).
 * Captura los eventos que alimentan el motor de recomendaciones:
 *   - VIEW     : visualización de un producto por >= 5 segundos (temporizador Angular)
 *   - CLICK    : el usuario abrió/hizo clic en el detalle del producto
 *   - ADD_CART : el usuario agregó el producto al carrito
 *   - PURCHASE : el usuario compró el producto (checkout confirmado) — señal más fuerte
 */
@Service
public class HistorialService {

    /**
     * Acciones válidas de comportamiento. VIEW/CLICK/ADD_CART las envía el frontend;
     * PURCHASE la registra el backend automáticamente al confirmar un pedido.
     */
    public static final Set<String> ACCIONES_VALIDAS = Set.of("VIEW", "CLICK", "ADD_CART", "PURCHASE");

    @Autowired
    private HistorialRepository historialRepository;

    /**
     * Registra un evento de comportamiento del usuario.
     *
     * @param idUsuario   usuario autenticado
     * @param idProducto  producto sobre el que ocurre el evento
     * @param accion      VIEW | CLICK | ADD_CART (case-insensitive)
     * @param permanencia segundos de permanencia (solo relevante para VIEW; 0 si no aplica)
     * @return el registro persistido
     */
    public Historial registrar(Long idUsuario, Long idProducto, String accion, Integer permanencia) {
        if (idProducto == null) {
            throw new IllegalArgumentException("id_producto es obligatorio");
        }
        String accionNorm = (accion == null ? "" : accion.trim().toUpperCase());
        if (!ACCIONES_VALIDAS.contains(accionNorm)) {
            throw new IllegalArgumentException(
                    "Acción inválida: '" + accion + "'. Permitidas: " + ACCIONES_VALIDAS);
        }

        Historial h = new Historial();
        h.setId_usuario(idUsuario);
        h.setId_producto(idProducto);
        h.setAccion(accionNorm);
        h.setPermanencia(permanencia != null ? permanencia : 0);
        h.setFecha(new Timestamp(System.currentTimeMillis()));
        return historialRepository.save(h);
    }

    /** Historial de interacciones de un usuario (más reciente primero). */
    public List<Historial> getByUsuario(Long idUsuario) {
        return historialRepository.findAll().stream()
                .filter(h -> h.getId_usuario() != null && h.getId_usuario().equals(idUsuario))
                .sorted((a, b) -> Long.compare(
                        b.getId_historial() != null ? b.getId_historial() : 0L,
                        a.getId_historial() != null ? a.getId_historial() : 0L))
                .toList();
    }
}
