package com.pry.demo.modulo_inventario.service;

import com.pry.demo.shared.model.Categoria;
import com.pry.demo.shared.model.AuditoriaCategoria;
import com.pry.demo.shared.repository.CategoriaRepository;
import com.pry.demo.shared.repository.AuditoriaCategoriaRepository;
import com.pry.demo.modulo_inventario.dto.CategoriaDTO;
import com.pry.demo.modulo_inventario.mapper.CategoriaMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AuditoriaCategoriaRepository auditoriaCategoriaRepository;

    @Autowired
    private CategoriaMapper categoriaMapper;

    @PersistenceContext
    private EntityManager entityManager;

    // ============================================================
    // Métodos para INVENTARIO (admin del catálogo)
    // ============================================================

    /** Lista todas las categorías (incluye dadas de baja). */
    public List<CategoriaDTO> getAllCategorias() {
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toDTO)
                .collect(Collectors.toList());
    }

    /** Obtiene una categoría por ID. */
    public CategoriaDTO getCategoriaById(Long id) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id " + id));
        return categoriaMapper.toDTO(c);
    }

    /** Crea una nueva categoría con estado=1 por defecto. */
    @Transactional
    public CategoriaDTO createCategoria(CategoriaDTO dto) {
        Categoria categoria = categoriaMapper.toEntity(dto);
        if (categoria.getEstado() == 0) {
            categoria.setEstado(1); // Activo por defecto
        }
        return categoriaMapper.toDTO(categoriaRepository.save(categoria));
    }

    /**
     * Actualiza una categoría existente y dispara el trigger de auditoría.
     * Registra @id_almacenero en la sesión MySQL para que el trigger lo capture.
     */
    @Transactional
    public CategoriaDTO updateCategoria(Long id, CategoriaDTO dto, Long idAlmacenero) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id " + id));

        // Registrar la variable de sesión para el trigger
        entityManager.createNativeQuery("SET @id_almacenero = :id")
                .setParameter("id", idAlmacenero)
                .executeUpdate();

        // Actualizar la categoría → dispara trg_categoria_before_update
        categoria.setNombre(dto.getNombre());
        if (dto.getEstado() != 0 || dto.getEstado() == 0) {
            categoria.setEstado(dto.getEstado());
        }
        return categoriaMapper.toDTO(categoriaRepository.save(categoria));
    }

    /**
     * Baja lógica: cambia estado a 0 en lugar de borrar físicamente.
     */
    @Transactional
    public void deleteCategoria(Long id, Long idAlmacenero) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id " + id));

        // Registrar la variable de sesión para el trigger
        entityManager.createNativeQuery("SET @id_almacenero = :id")
                .setParameter("id", idAlmacenero)
                .executeUpdate();

        // Baja lógica → también dispara el trigger de auditoría
        categoria.setEstado(0);
        categoriaRepository.save(categoria);
    }

    // ============================================================
    // Métodos públicos para CLIENTE
    // ============================================================

    /** Lista las categorías activas (estado=1) para el catálogo de clientes. */
    public List<CategoriaDTO> getCategoriasActivas() {
        return categoriaRepository.findByEstado(1).stream()
                .map(categoriaMapper::toDTO)
                .collect(Collectors.toList());
    }
}
