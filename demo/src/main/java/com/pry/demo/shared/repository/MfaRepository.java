package com.pry.demo.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pry.demo.shared.model.Mfa;

public interface MfaRepository extends JpaRepository<Mfa, Long> {
}
