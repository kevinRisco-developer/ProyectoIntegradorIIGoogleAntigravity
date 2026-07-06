package com.pry.demo.shared.repository;

import com.pry.demo.shared.model.BackupLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BackupLogRepository extends JpaRepository<BackupLog, Long> {
    @Query("SELECT b FROM BackupLog b ORDER BY b.fecha DESC")
    List<BackupLog> findAllOrdenado();
}
