-- =============================================================
-- Migración: tabla de reseñas y calificaciones de producto
-- ImportSmart — Proyecto Integrador II
-- =============================================================
-- Reseñas de productos COMPRADOS, hechas por usuarios con rol CLIENTE.
-- Restricción CHECK: calificacion entre 1 y 5 (aplicada en MySQL 8).
-- UNIQUE (id_usuario, id_producto): una reseña por producto por cliente
-- (un nuevo envío actualiza la existente).
--
-- Ejecutar ANTES de reiniciar la aplicación (ddl-auto=none).
-- =============================================================

CREATE TABLE IF NOT EXISTS resena (
    id_resena    BIGINT        NOT NULL AUTO_INCREMENT,
    id_usuario   INT           NOT NULL,
    id_producto  INT           NOT NULL,
    calificacion INT           NOT NULL,
    comentario   VARCHAR(1000) NULL,
    fecha        TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_resena),
    UNIQUE KEY uk_resena_usuario_producto (id_usuario, id_producto),
    KEY idx_resena_producto (id_producto),
    CONSTRAINT chk_resena_calificacion CHECK (calificacion BETWEEN 1 AND 5),
    CONSTRAINT fk_resena_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuario (id_usuario)  ON DELETE CASCADE,
    CONSTRAINT fk_resena_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
