package com.pry.demo.modulo_inventario.service;

import com.pry.demo.shared.model.Categoria;
import com.pry.demo.shared.model.AuditoriaCategoria;
import com.pry.demo.shared.repository.CategoriaRepository;
import com.pry.demo.shared.repository.AuditoriaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AuditoriaCategoriaRepository auditoriaCategoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada con id " + id));
    }

    public Categoria createCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria updateCategoria(Long id, Categoria details, Long idAlmacenero) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada con id " + id));

        // Create audit record
        AuditoriaCategoria audit = new AuditoriaCategoria();
        audit.setId_categoria(categoria.getId_categoria());
        audit.setNombre(categoria.getNombre());
        audit.setFecha_actualizacion(new Timestamp(System.currentTimeMillis()));
        audit.setId_almacenero(idAlmacenero);
        auditoriaCategoriaRepository.save(audit);

        // Update category
        categoria.setNombre(details.getNombre());
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public void deleteCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada con id " + id));
        categoriaRepository.delete(categoria);
    }
}
