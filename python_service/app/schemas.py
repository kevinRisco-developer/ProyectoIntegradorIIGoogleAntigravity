"""Esquemas Pydantic para las respuestas del endpoint /recomendar."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class RecomendacionItem(BaseModel):
    id_producto: int
    nombre: Optional[str] = None
    marca: Optional[str] = None
    id_categoria: Optional[int] = None
    precio: Optional[float] = None
    score: float
    origen: str  # colaborativo | perfil | complemento | popularidad


class RecomendarResponse(BaseModel):
    id_usuario: int
    total: int
    entrenado_en: Optional[str] = None
    recomendaciones: List[RecomendacionItem]


class ComplementarioResponse(BaseModel):
    id_producto: int
    total: int
    complementarios: List[RecomendacionItem]


class EntrenamientoResponse(BaseModel):
    ok: bool
    mensaje: str
    entrenado_en: Optional[str] = None
    metricas: Dict[str, Any] = {}


class EstadoResponse(BaseModel):
    status: str
    version: str
    entrenado_en: Optional[str] = None
    metricas: Dict[str, Any] = {}
