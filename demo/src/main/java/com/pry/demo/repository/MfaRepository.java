package com.pry.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.model.Mfa;
public interface MfaRepository  extends JpaRepository<Mfa, Long> {

}
