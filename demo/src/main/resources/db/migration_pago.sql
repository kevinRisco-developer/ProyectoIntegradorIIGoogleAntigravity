-- =============================================================
-- Migración: tabla de pagos (HU-12 / checkout)
-- ImportSmart — Proyecto Integrador II
-- =============================================================
-- La entidad `Pago` (procesarPagoSimulado) insertaba en `pago`, pero la tabla
-- nunca existió (spring.jpa.hibernate.ddl-auto=none) → el checkout fallaba con
-- 500 "Table 'railway.pago' doesn't exist" al crear cualquier pedido.
--
-- Ejecutar ANTES de reiniciar la aplicación.
-- =============================================================

CREATE TABLE IF NOT EXISTS pago (
    id_pago   BIGINT       NOT NULL AUTO_INCREMENT,
    id_pedido INT          NOT NULL,
    monto     DOUBLE       NOT NULL,
    metodo    VARCHAR(100) NULL,
    estado    VARCHAR(50)  NULL,
    fecha     TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_pago),
    KEY idx_pago_pedido (id_pedido),
    CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
