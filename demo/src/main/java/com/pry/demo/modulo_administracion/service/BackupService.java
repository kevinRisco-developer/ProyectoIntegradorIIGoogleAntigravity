package com.pry.demo.modulo_administracion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para generar backups de la base de datos MySQL mediante mysqldump.
 * Requiere que mysqldump esté instalado en el PATH del servidor.
 */
@Service
public class BackupService {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${backup.directory:./backups}")
    private String backupDirectory;

    /**
     * Genera un backup de la BD usando mysqldump.
     * @return nombre del archivo de backup generado
     * @throws Exception si ocurre algún error durante el proceso
     */
    public String generarBackup() throws Exception {
        // Extraer nombre de la BD desde la URL (jdbc:mysql://host:port/db_name)
        String dbName = extraerNombreDB(datasourceUrl);
        if (dbName == null || dbName.isBlank()) {
            throw new IllegalStateException("No se pudo determinar el nombre de la base de datos desde la URL.");
        }

        // Crear directorio de backups si no existe
        File backupDir = new File(backupDirectory);
        if (!backupDir.exists()) {
            backupDir.mkdirs();
        }

        // Nombre del archivo: backup_importsmart_YYYY-MM-DD_HH-mm-ss.sql
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String fileName = "backup_" + dbName + "_" + timestamp + ".sql";
        String filePath = backupDirectory + File.separator + fileName;

        // Extraer host y puerto de la URL
        String hostPort = extraerHostPort(datasourceUrl);
        String host = hostPort.split(":")[0];
        String port = hostPort.contains(":") ? hostPort.split(":")[1] : "3306";

        // Construir comando mysqldump
        ProcessBuilder pb = new ProcessBuilder(
                "mysqldump",
                "-h", host,
                "-P", port,
                "-u", dbUsername,
                "-p" + dbPassword,
                "--databases", dbName,
                "--single-transaction",
                "--routines",
                "--triggers",
                "--result-file=" + filePath
        );
        pb.redirectErrorStream(true);

        Process process = pb.start();

        // Capturar salida del proceso
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("mysqldump falló con código: " + exitCode + "\nSalida: " + output);
        }

        System.out.println("Backup generado exitosamente: " + filePath);
        return fileName;
    }

    /**
     * Lista los backups disponibles en el directorio configurado.
     */
    public String[] listarBackups() {
        File dir = new File(backupDirectory);
        if (!dir.exists()) return new String[0];
        String[] files = dir.list((d, name) -> name.endsWith(".sql"));
        return files != null ? files : new String[0];
    }

    /**
     * Extrae el nombre de la BD de una URL JDBC MySQL.
     * Ejemplo: jdbc:mysql://localhost:3306/importsmart → importsmart
     */
    private String extraerNombreDB(String url) {
        if (url == null) return null;
        // Eliminar parámetros: jdbc:mysql://host:port/db?param=value
        String path = url.replaceAll("\\?.*", "");
        int lastSlash = path.lastIndexOf('/');
        return lastSlash >= 0 && lastSlash < path.length() - 1
                ? path.substring(lastSlash + 1)
                : null;
    }

    /**
     * Extrae host:port de una URL JDBC MySQL.
     * Ejemplo: jdbc:mysql://localhost:3306/db → localhost:3306
     */
    private String extraerHostPort(String url) {
        // jdbc:mysql://host:port/db
        String stripped = url.replace("jdbc:mysql://", "").replaceAll("/.*", "");
        return stripped;
    }
}
