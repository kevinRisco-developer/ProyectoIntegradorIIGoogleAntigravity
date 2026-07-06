package com.pry.demo.modulo_administracion.service;

import com.pry.demo.shared.model.BackupLog;
import com.pry.demo.shared.repository.BackupLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Genera respaldos de la BD MySQL (HU-34).
 * Preferentemente ejecuta el script bash `backup.sh` vía ProcessBuilder (mysqldump +
 * retención de 30 días); si el script no está disponible, hace mysqldump directo.
 * Cada intento (MANUAL o CRON) queda registrado en la tabla backup_log.
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

    @Value("${backup.script:./scripts/backup.sh}")
    private String backupScript;

    // Ruta al ejecutable mysqldump. En Linux/Railway suele estar en el PATH ("mysqldump");
    // en Windows se apunta a la ruta completa vía la variable BACKUP_MYSQLDUMP.
    @Value("${backup.mysqldump:mysqldump}")
    private String mysqldumpBin;

    @Autowired
    private BackupLogRepository backupLogRepository;

    /**
     * Genera un respaldo distinguiendo el origen (MANUAL/CRON) y lo registra en el log.
     * @param tipo    "MANUAL" o "CRON"
     * @param idAdmin id del administrador que lo disparó (null si es CRON)
     * @return nombre del archivo generado
     */
    public String generarBackup(String tipo, Integer idAdmin) throws Exception {
        String dbName = extraerNombreDB(datasourceUrl);
        if (dbName == null || dbName.isBlank()) {
            throw new IllegalStateException("No se pudo determinar el nombre de la base de datos desde la URL.");
        }
        File backupDir = new File(backupDirectory);
        if (!backupDir.exists()) backupDir.mkdirs();

        String hostPort = extraerHostPort(datasourceUrl);
        String host = hostPort.split(":")[0];
        String port = hostPort.contains(":") ? hostPort.split(":")[1] : "3306";

        try {
            String fileName;
            try {
                fileName = ejecutarScript(tipo, host, port, dbName);
            } catch (Exception scriptEx) {
                System.err.println("[BACKUP] Script .sh no disponible/falló (" + scriptEx.getMessage()
                        + "). Usando mysqldump directo.");
                fileName = ejecutarDirecto(tipo, host, port, dbName);
            }
            File f = new File(backupDirectory, fileName);
            long size = f.exists() ? f.length() : 0L;
            registrarLog(fileName, tipo, "OK", size, idAdmin, null);
            System.out.println("[BACKUP] " + tipo + " generado: " + fileName);
            return fileName;
        } catch (Exception e) {
            registrarLog(null, tipo, "ERROR", null, idAdmin, truncar(e.getMessage(), 500));
            throw e;
        }
    }

    /** Compatibilidad: respaldo manual sin admin identificado. */
    public String generarBackup() throws Exception {
        return generarBackup("MANUAL", null);
    }

    // ---- Ejecución vía script bash (ProcessBuilder) ----
    private String ejecutarScript(String tipo, String host, String port, String dbName) throws Exception {
        File script = new File(backupScript);
        if (!script.exists()) {
            throw new FileNotFoundException("Script no encontrado: " + script.getAbsolutePath());
        }
        ProcessBuilder pb = new ProcessBuilder(
                "bash", script.getAbsolutePath(),
                tipo.toLowerCase(), host, port, dbUsername, dbPassword, dbName, backupDirectory, mysqldumpBin);
        Process p = pb.start();
        String out = leerTodo(p.getInputStream());
        String err = leerTodo(p.getErrorStream());
        int code = p.waitFor();
        if (code != 0) {
            throw new RuntimeException("backup.sh terminó con código " + code + ": " + err);
        }
        String fileName = ultimaLinea(out);
        if (fileName == null || fileName.isBlank()) {
            throw new RuntimeException("backup.sh no devolvió el nombre del archivo");
        }
        return fileName.trim();
    }

    // ---- Fallback: mysqldump directo ----
    private String ejecutarDirecto(String tipo, String host, String port, String dbName) throws Exception {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String fileName = "backup_" + dbName + "_" + tipo.toLowerCase() + "_" + timestamp + ".sql";
        String filePath = backupDirectory + File.separator + fileName;

        ProcessBuilder pb = new ProcessBuilder(
                mysqldumpBin, "-h", host, "-P", port, "-u", dbUsername, "-p" + dbPassword,
                "--databases", dbName, "--single-transaction", "--routines", "--triggers",
                "--result-file=" + filePath);
        pb.redirectErrorStream(true);
        Process p = pb.start();
        String out = leerTodo(p.getInputStream());
        int code = p.waitFor();
        if (code != 0) {
            throw new RuntimeException("mysqldump falló con código " + code + ": " + out);
        }
        limpiarAntiguos(); // retención de 30 días también en la ruta directa
        return fileName;
    }

    /** Lista los archivos .sql disponibles en el directorio. */
    public String[] listarBackups() {
        File dir = new File(backupDirectory);
        if (!dir.exists()) return new String[0];
        String[] files = dir.list((d, name) -> name.endsWith(".sql"));
        return files != null ? files : new String[0];
    }

    /** Historial de respaldos desde la tabla de log. */
    public List<BackupLog> listarLog() {
        return backupLogRepository.findAllOrdenado();
    }

    // ---- Helpers ----
    private void registrarLog(String archivo, String tipo, String estado, Long size, Integer idAdmin, String mensaje) {
        try {
            BackupLog log = new BackupLog();
            log.setArchivo(archivo);
            log.setTipo(tipo != null ? tipo.toUpperCase() : "MANUAL");
            log.setEstado(estado);
            log.setTamano_bytes(size);
            log.setId_admin(idAdmin);
            log.setMensaje(mensaje);
            log.setFecha(new Timestamp(System.currentTimeMillis()));
            backupLogRepository.save(log);
        } catch (Exception ignore) {
            System.err.println("[BACKUP] No se pudo registrar el log: " + ignore.getMessage());
        }
    }

    private void limpiarAntiguos() {
        File dir = new File(backupDirectory);
        File[] files = dir.listFiles((d, n) -> n.startsWith("backup_") && n.endsWith(".sql"));
        if (files == null) return;
        long cutoff = System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000;
        for (File f : files) {
            if (f.lastModified() < cutoff) f.delete();
        }
    }

    private String leerTodo(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = r.readLine()) != null) sb.append(line).append("\n");
        }
        return sb.toString();
    }

    private String ultimaLinea(String s) {
        if (s == null) return null;
        String[] lines = s.strip().split("\\R");
        return lines.length == 0 ? null : lines[lines.length - 1];
    }

    private String truncar(String s, int max) {
        if (s == null) return null;
        return s.length() > max ? s.substring(0, max) : s;
    }

    private String extraerNombreDB(String url) {
        if (url == null) return null;
        String path = url.replaceAll("\\?.*", "");
        int lastSlash = path.lastIndexOf('/');
        return lastSlash >= 0 && lastSlash < path.length() - 1 ? path.substring(lastSlash + 1) : null;
    }

    private String extraerHostPort(String url) {
        return url.replace("jdbc:mysql://", "").replaceAll("/.*", "");
    }
}
