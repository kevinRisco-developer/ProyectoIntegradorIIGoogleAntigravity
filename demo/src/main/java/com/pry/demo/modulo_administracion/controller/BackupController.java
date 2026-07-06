package com.pry.demo.modulo_administracion.controller;

import com.pry.demo.modulo_administracion.service.BackupService;
import com.pry.demo.shared.model.Usuario;
import com.pry.demo.shared.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/admin/backup")
@CrossOrigin(origins = "*")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${backup.directory:./backups}")
    private String backupDirectory;

    /**
     * Dispara un respaldo MANUAL de la BD. Solo ADMIN (validado en SecurityConfig).
     * Registra en backup_log el admin que lo ejecutó.
     */
    @PostMapping("/generar")
    public ResponseEntity<?> generarBackup() {
        try {
            String fileName = backupService.generarBackup("MANUAL", getAdminId());
            return ResponseEntity.ok(Map.of(
                    "message", "Backup generado exitosamente",
                    "archivo", fileName
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Error generando backup: " + e.getMessage()
            ));
        }
    }

    /** Historial de respaldos (tabla backup_log). */
    @GetMapping("/log")
    public ResponseEntity<?> listarLog() {
        return ResponseEntity.ok(backupService.listarLog());
    }

    private Integer getAdminId() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario u = usuarioRepository.findByEmail(email);
            return u != null ? u.getId_usuario().intValue() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Lista todos los backups disponibles en el servidor.
     */
    @GetMapping("/listar")
    public ResponseEntity<?> listarBackups() {
        String[] archivos = backupService.listarBackups();
        return ResponseEntity.ok(Map.of(
                "backups", archivos,
                "total", archivos.length
        ));
    }

    /**
     * Descarga un backup específico por nombre de archivo.
     */
    @GetMapping("/descargar/{fileName}")
    public ResponseEntity<Resource> descargarBackup(@PathVariable String fileName) {
        // Sanitizar el nombre para prevenir path traversal
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            return ResponseEntity.badRequest().build();
        }

        File file = new File(backupDirectory + File.separator + fileName);
        if (!file.exists() || !file.isFile()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
}
