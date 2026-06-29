-- =============================================================
-- Script de migración: Máquina de estados del Pedido
-- ImportSmart — Proyecto Integrador II
-- Fecha: 2026-06-25
-- =============================================================
-- Migra los estados de texto libre anteriores al Enum EstadoPedido:
--   'PENDIENTE'   →  'EN_PROCESO'   (estado inicial automático)
--   'COMPLETADO'  →  'PAGADO'       (pago simulado confirmado)
--
-- Ejecutar ANTES de reiniciar la aplicación con el nuevo código.
-- =============================================================

-- 1. Migrar pedidos en estado antiguo 'PENDIENTE' → 'EN_PROCESO'
UPDATE pedido
SET estado = 'EN_PROCESO'
WHERE estado = 'PENDIENTE';

-- 2. Migrar pedidos en estado antiguo 'COMPLETADO' → 'PAGADO'
UPDATE pedido
SET estado = 'PAGADO'
WHERE estado = 'COMPLETADO';

-- 3. Verificación (opcional): revisar si quedan valores inesperados
-- SELECT DISTINCT estado FROM pedido;

-- =============================================================
-- Los únicos valores válidos tras la migración son:
--   EN_PROCESO | PAGADO | ENTREGADO
-- =============================================================
