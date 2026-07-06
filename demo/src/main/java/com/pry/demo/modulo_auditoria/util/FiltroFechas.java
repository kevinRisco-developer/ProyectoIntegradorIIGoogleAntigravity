package com.pry.demo.modulo_auditoria.util;

import java.sql.Timestamp;
import java.time.LocalDate;

/** Utilidades para parsear los parámetros de filtro de auditoría (fechas ISO yyyy-MM-dd). */
public final class FiltroFechas {

    private FiltroFechas() {}

    /** yyyy-MM-dd → inicio del día (00:00:00). Null si vacío. */
    public static Timestamp desde(String s) {
        if (s == null || s.isBlank()) return null;
        return Timestamp.valueOf(LocalDate.parse(s.trim()).atStartOfDay());
    }

    /** yyyy-MM-dd → fin del día (23:59:59). Null si vacío. */
    public static Timestamp hasta(String s) {
        if (s == null || s.isBlank()) return null;
        return Timestamp.valueOf(LocalDate.parse(s.trim()).atTime(23, 59, 59));
    }

    /** Cadena en blanco → null. */
    public static String nb(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
