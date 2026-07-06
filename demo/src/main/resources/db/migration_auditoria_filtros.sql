-- =============================================================
-- Migración: columnas para filtros de auditoría (HU-31/32/33)
-- ImportSmart — Proyecto Integrador II
-- =============================================================
-- Agrega `accion` (tipo de acción) a las 3 tablas de auditoría y `fecha`
-- a auditoria_usuario (que no tenía marca de tiempo). Con valores por defecto,
-- los triggers existentes siguen insertando sin cambios (usan el DEFAULT).
--
-- Ejecutar ANTES de reiniciar la aplicación (ddl-auto=none).
-- =============================================================

ALTER TABLE auditoria_usuario   ADD COLUMN accion VARCHAR(30) NOT NULL DEFAULT 'MODIFICACION';
ALTER TABLE auditoria_usuario   ADD COLUMN fecha  TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE auditoria_producto  ADD COLUMN accion VARCHAR(30) NOT NULL DEFAULT 'MODIFICACION';
ALTER TABLE auditoria_categoria ADD COLUMN accion VARCHAR(30) NOT NULL DEFAULT 'MODIFICACION';
