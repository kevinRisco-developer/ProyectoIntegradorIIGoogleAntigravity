-- =============================================================
-- Migración: tabla de log de respaldos (HU-34)
-- ImportSmart — Proyecto Integrador II
-- =============================================================
-- Registra cada respaldo de la BD: nombre de archivo, origen (MANUAL/CRON),
-- estado (OK/ERROR), tamaño, admin que lo disparó y fecha.
--
-- Ejecutar ANTES de reiniciar la aplicación (ddl-auto=none).
-- =============================================================

CREATE TABLE IF NOT EXISTS backup_log (
    id_backup_log BIGINT       NOT NULL AUTO_INCREMENT,
    archivo       VARCHAR(255) NULL,
    tipo          VARCHAR(20)  NOT NULL,   -- MANUAL | CRON
    estado        VARCHAR(20)  NOT NULL,   -- OK | ERROR
    tamano_bytes  BIGINT       NULL,
    id_admin      INT          NULL,       -- NULL cuando el origen es CRON
    mensaje       VARCHAR(500) NULL,       -- detalle de error, si aplica
    fecha         TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_backup_log),
    KEY idx_backup_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
