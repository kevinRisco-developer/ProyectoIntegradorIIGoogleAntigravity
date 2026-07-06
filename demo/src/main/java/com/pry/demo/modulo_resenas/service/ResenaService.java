package com.pry.demo.modulo_resenas.service;

import com.pry.demo.modulo_resenas.dto.ResenaDTO;
import com.pry.demo.modulo_resenas.dto.ResenaRequestDTO;
import com.pry.demo.shared.model.Resena;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.Detalle_pedidoRepository;
import com.pry.demo.shared.repository.ResenaRepository;
import com.pry.demo.shared.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private Detalle_pedidoRepository detallePedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Crea o actualiza la reseña del cliente para un producto que HA COMPRADO.
     */
    public ResenaDTO crearOActualizar(String email, ResenaRequestDTO req) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        if (req.getCalificacion() < 1 || req.getCalificacion() > 5) {
            throw new IllegalArgumentException("La calificación debe estar entre 1 y 5");
        }

        // Solo se puede reseñar un producto comprado (pedido pagado o entregado).
        long compras = detallePedidoRepository.countComprasProducto(user.getId_usuario(), req.getId_producto());
        if (compras == 0) {
            throw new IllegalArgumentException("Solo puedes reseñar productos que has comprado");
        }

        Resena resena = resenaRepository.findByUsuarioAndProducto(user.getId_usuario(), req.getId_producto());
        if (resena == null) {
            resena = new Resena();
            resena.setId_usuario(user.getId_usuario());
            resena.setId_producto(req.getId_producto());
        }
        resena.setCalificacion(req.getCalificacion());
        resena.setComentario(req.getComentario());
        resena.setFecha(new Timestamp(System.currentTimeMillis()));

        Resena guardada = resenaRepository.save(resena);
        return toDTO(guardada, user.getNombre());
    }

    /**
     * Reseñas de un producto + promedio y total (público).
     */
    public Map<String, Object> listarPorProducto(Long idProducto) {
        List<Resena> resenas = resenaRepository.findByProducto(idProducto);

        // Resolver nombres de usuario con una caché local.
        Map<Long, String> nombres = new HashMap<>();
        List<ResenaDTO> dtos = resenas.stream()
                .map(r -> toDTO(r, nombres.computeIfAbsent(r.getId_usuario(), this::nombreUsuario)))
                .collect(Collectors.toList());

        Double promedio = resenaRepository.promedioByProducto(idProducto);
        long total = resenaRepository.countByProducto(idProducto);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("promedio", promedio != null ? Math.round(promedio * 10.0) / 10.0 : 0.0);
        resp.put("total", total);
        resp.put("resenas", dtos);
        return resp;
    }

    /**
     * Para el usuario autenticado: ¿puede reseñar (lo compró)? ¿ya reseñó? y su reseña actual.
     */
    public Map<String, Object> estadoParaUsuario(String email, Long idProducto) {
        Usuario user = usuarioRepository.findByEmail(email);
        Map<String, Object> resp = new LinkedHashMap<>();
        if (user == null) {
            resp.put("puede", false);
            resp.put("yaReseno", false);
            resp.put("miResena", null);
            return resp;
        }
        long compras = detallePedidoRepository.countComprasProducto(user.getId_usuario(), idProducto);
        Resena existente = resenaRepository.findByUsuarioAndProducto(user.getId_usuario(), idProducto);
        resp.put("puede", compras > 0);
        resp.put("yaReseno", existente != null);
        resp.put("miResena", existente != null ? toDTO(existente, user.getNombre()) : null);
        return resp;
    }

    private String nombreUsuario(Long idUsuario) {
        return usuarioRepository.findById(idUsuario).map(Usuario::getNombre).orElse("Cliente");
    }

    private ResenaDTO toDTO(Resena r, String nombreUsuario) {
        return new ResenaDTO(r.getId_resena(), r.getId_usuario(), nombreUsuario, r.getId_producto(),
                r.getCalificacion(), r.getComentario(), r.getFecha());
    }
}
