-- =============================================================
-- Script de migración: Tabla de recuperación de contraseña (HU-04)
-- ImportSmart — Proyecto Integrador II — Sprint 2
-- =============================================================
-- Reemplaza el almacenamiento en memoria del token de recuperación
-- por una tabla persistente con token expirable y marca de uso.
--
-- Ejecutar ANTES de reiniciar la aplicación con el nuevo código.
-- (spring.jpa.hibernate.ddl-auto=none → la tabla NO se crea sola)
-- =============================================================

CREATE TABLE IF NOT EXISTS recuperacion_contrasena (
    id_recuperacion BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario      INT          NOT NULL,
    token           VARCHAR(255) NOT NULL,
    expira_en       TIMESTAMP    NOT NULL,
    usado           TINYINT(1)   NOT NULL DEFAULT 0,
    fecha_creacion  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_recuperacion),
    UNIQUE KEY uk_recuperacion_token (token),
    KEY idx_recuperacion_usuario (id_usuario),
    CONSTRAINT fk_recuperacion_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- Notas:
--   * token: UUID de un solo uso enviado por correo (Gmail SMTP).
--   * expira_en: normalmente creación + 15 minutos.
--   * usado: se marca en 1 tras restablecer la contraseña.
-- =============================================================
