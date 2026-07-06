"""Endpoints del motor de recomendaciones."""
from fastapi import APIRouter, Query

from .. import recommender, trainer
from ..schemas import (
    RecomendarResponse, ComplementarioResponse, EntrenamientoResponse, EstadoResponse,
)

router = APIRouter()


@router.get("/", response_model=EstadoResponse)
def estado():
    bundle = trainer.cargar_bundle()
    return EstadoResponse(
        status="AI Service Running",
        version="2.0",
        entrenado_en=bundle.get("entrenado_en"),
        metricas=bundle.get("metricas", {}),
    )


@router.get("/recomendar/{user_id}", response_model=RecomendarResponse)
def recomendar(user_id: int, limit: int = Query(6, ge=1, le=50)):
    """Recomendaciones personalizadas para un usuario (HU-15).

    Consumido por el backend Spring vía WebClient, que persiste el resultado
    en la tabla `recomendacion`.
    """
    items, entrenado_en = recommender.recomendar_usuario(user_id, limit)
    return RecomendarResponse(
        id_usuario=user_id,
        total=len(items),
        entrenado_en=entrenado_en,
        recomendaciones=items,
    )


@router.get("/complementarios/{product_id}", response_model=ComplementarioResponse)
def complementarios(product_id: int, limit: int = Query(4, ge=1, le=20)):
    """Productos complementarios (Apriori): p. ej. una laptop sugiere mouse/licencias."""
    items, _ = recommender.complementarios_producto(product_id, limit)
    return ComplementarioResponse(
        id_producto=product_id,
        total=len(items),
        complementarios=items,
    )


@router.post("/entrenar", response_model=EntrenamientoResponse)
def entrenar():
    """Reentrena el modelo bajo demanda (además del reentrenamiento cada 12h)."""
    bundle = trainer.entrenar_todo()
    return EntrenamientoResponse(
        ok=True,
        mensaje="Modelo reentrenado correctamente.",
        entrenado_en=bundle.get("entrenado_en"),
        metricas=bundle.get("metricas", {}),
    )


# --- Compatibilidad: el endpoint legacy devuelve solo IDs (list[int]) --------
@router.get("/recommend/{user_id}")
def recommend_legacy(user_id: int, limit: int = 4):
    items, _ = recommender.recomendar_usuario(user_id, limit)
    return [it["id_producto"] for it in items]
