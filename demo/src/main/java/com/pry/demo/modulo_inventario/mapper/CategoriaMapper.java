package com.pry.demo.modulo_inventario.mapper;

import com.pry.demo.shared.model.Categoria;
import com.pry.demo.modulo_inventario.dto.CategoriaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {
    CategoriaMapper INSTANCE = Mappers.getMapper(CategoriaMapper.class);

    CategoriaDTO toDTO(Categoria categoria);
    Categoria toEntity(CategoriaDTO dto);
}
