"""Configuración del servicio de recomendaciones (variables de entorno)."""
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "")
DB_NAME = os.getenv("DB_NAME", "railway")

# Cada cuántas horas se reentrena el modelo (APScheduler).
RETRAIN_HORAS = int(os.getenv("RETRAIN_HORAS", "12"))


def database_url() -> str:
    """URL de conexión SQLAlchemy (driver PyMySQL)."""
    return f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASS)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
