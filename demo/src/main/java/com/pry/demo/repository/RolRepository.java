package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Rol;
public interface RolRepository  extends JpaRepository<Rol, Long> {

}
