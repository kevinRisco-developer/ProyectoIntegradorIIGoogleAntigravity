package com.pry.demo.modulo_administracion.controller;

import com.pry.demo.modulo_administracion.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/admin/backup")
@CrossOrigin(origins = "*")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @Value("${backup.directory:./backups}")
    private String backupDirectory;

    /**
     * Genera un nuevo backup de la base de datos.
     * Solo accesible por ADMIN (controlado en SecurityConfig).
     */
    @PostMapping("/generar")
    public ResponseEntity<?> generarBackup() {
        try {
            String fileName = backupService.generarBackup();
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
