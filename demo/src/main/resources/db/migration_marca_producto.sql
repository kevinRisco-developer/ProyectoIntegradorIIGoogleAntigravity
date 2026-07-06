-- Sprint IA — Agrega la columna `marca` a producto para el pipeline de
-- recomendaciones (agrupación por marca/categoría/precio en el servicio FastAPI).
-- ddl-auto=none: se aplica manualmente en Railway.
--
-- IMPORTANTE: se agrega como ÚLTIMA columna de producto (AFTER descuento) para
-- que el procedure `producto_categoria()` (SELECT *) mantenga las columnas de
-- categoria al final. El mapeo por índice en ProductoService quedó actualizado
-- en consecuencia (marca = [9], categoria = [10..12]).

ALTER TABLE producto
    ADD COLUMN marca VARCHAR(100) NULL AFTER descuento;
