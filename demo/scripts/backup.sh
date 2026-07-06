#!/usr/bin/env bash
# =============================================================
# backup.sh — Respaldo de la BD MySQL de ImportSmart (HU-34)
# =============================================================
# Uso:
#   backup.sh <tipo> <host> <port> <user> <pass> <db> <dir>
#     tipo : manual | cron   (distingue el origen del respaldo)
#
# - Genera un dump con mysqldump (--single-transaction --routines --triggers)
# - Aplica RETENCIÓN de 30 días (elimina respaldos más antiguos)
# - Imprime en stdout el nombre del archivo generado (última línea)
#
# Ejemplo de cron (respaldo diario a las 3am, origen cron):
#   0 3 * * * /ruta/backup.sh cron <host> <port> <user> <pass> railway /ruta/backups
# =============================================================
set -euo pipefail

TIPO="${1:-manual}"
HOST="${2:?host requerido}"
PORT="${3:?puerto requerido}"
USER="${4:?usuario requerido}"
PASS="${5:?password requerido}"
DB="${6:?base de datos requerida}"
DIR="${7:-./backups}"
MYSQLDUMP="${8:-mysqldump}"

mkdir -p "$DIR"
TS="$(date +%Y-%m-%d_%H-%M-%S)"
FILE="backup_${DB}_${TIPO}_${TS}.sql"

"$MYSQLDUMP" -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" \
  --databases "$DB" --single-transaction --routines --triggers \
  --result-file="${DIR}/${FILE}"

# Retención: eliminar respaldos con más de 30 días de antigüedad
find "$DIR" -maxdepth 1 -name 'backup_*.sql' -type f -mtime +30 -delete 2>/dev/null || true

# El nombre del archivo va en la última línea de stdout (lo lee el backend)
echo "$FILE"
