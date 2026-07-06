-- =============================================================
-- Fix: trigger de auditoría bloquea el enrolamiento MFA
-- ImportSmart — Proyecto Integrador II — Sprint 2
-- =============================================================
-- El trigger `trg_usuario_before_update` copia los valores OLD de la fila
-- de `usuario` a `auditoria_usuario` en CADA actualización. Para un usuario
-- que aún no tiene MFA, OLD.totp_secret es NULL; como la columna de auditoría
-- era NOT NULL, el trigger fallaba con:
--     ERROR 1048: Column 'totp_secret' cannot be null
-- Esto rompía /mfa/setup (y cualquier UPDATE sobre usuarios sin MFA).
--
-- Además, el trigger no informa `id_admin` (acciones self-service como el
-- enrolamiento MFA no son ejecutadas por un administrador), por lo que esa
-- columna también debe admitir NULL.
--
-- Ejecutar ANTES de reiniciar la aplicación.
-- =============================================================

ALTER TABLE auditoria_usuario MODIFY totp_secret VARCHAR(255) NULL;
ALTER TABLE auditoria_usuario MODIFY id_admin    INT          NULL;

-- =============================================================
-- Verificación (opcional):
--   SHOW CREATE TABLE auditoria_usuario;
-- =============================================================
