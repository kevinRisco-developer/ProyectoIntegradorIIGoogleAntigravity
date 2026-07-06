package com.pry.demo.modulo_administracion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Respaldo automático programado (HU-34, origen CRON).
 * Equivalente en la aplicación a un cron del sistema; también se puede invocar
 * el script backup.sh directamente desde el cron del SO en producción (Linux).
 */
@Component
public class BackupScheduler {

    @Autowired
    private BackupService backupService;

    // Por defecto, todos los días a las 03:00. Configurable con backup.cron.
    @Scheduled(cron = "${backup.cron:0 0 3 * * *}")
    public void respaldoAutomatico() {
        try {
            backupService.generarBackup("CRON", null);
        } catch (Exception e) {
            System.err.println("[CRON] Respaldo automático falló: " + e.getMessage());
        }
    }
}
