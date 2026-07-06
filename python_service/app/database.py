"""Motor y sesión SQLAlchemy.

pool_recycle/pool_pre_ping mitigan el cierre de conexiones ociosas del proxy
de Railway (mismo gotcha que HikariCP en el backend Java).
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import database_url

engine = create_engine(
    database_url(),
    pool_pre_ping=True,
    pool_recycle=270,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    """Dependencia FastAPI: entrega una sesión y la cierra al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
