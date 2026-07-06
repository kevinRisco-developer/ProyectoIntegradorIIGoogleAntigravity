"""Entrenamiento y persistencia del modelo (joblib).

Ejecuta el pipeline completo, entrena el filtrado colaborativo y las reglas de
asociación, y guarda todo en un único bundle serializado con joblib.
Usado bajo demanda (endpoint /entrenar) y por el reentrenamiento programado.
"""
import os
import threading
from datetime import datetime, timezone

import joblib

from .database import engine
from . import pipeline, collaborative, associations

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models_store")
MODEL_PATH = os.path.join(MODEL_DIR, "modelo.joblib")

_lock = threading.Lock()
_cache = {"bundle": None}


def entrenar_todo() -> dict:
    """Reentrena y persiste el modelo. Thread-safe (no bloquea el endpoint)."""
    with _lock:
        os.makedirs(MODEL_DIR, exist_ok=True)

        productos, historial, pedidos, detalle = pipeline.cargar_datos(engine)
        productos = pipeline.limpiar_productos(productos)
        inter = pipeline.construir_interacciones(historial, pedidos, detalle)
        perfiles = pipeline.perfiles_usuario(inter, productos)
        cf = collaborative.entrenar(inter)
        reglas = associations.entrenar(pedidos, detalle)
        compras = pipeline.compras_por_usuario(pedidos, detalle)

        metricas = {
            "productos": int(len(productos)),
            "interacciones": int(len(inter)),
            "usuarios_con_historial": int(inter["id_usuario"].nunique()) if not inter.empty else 0,
            "reglas_asociacion": int(len(reglas)),
        }

        bundle = {
            "entrenado_en": datetime.now(timezone.utc).isoformat(),
            "productos": productos.to_dict("records"),
            "cf": cf,
            "perfiles": {k: v.to_dict("records") for k, v in perfiles.items()},
            "reglas": reglas,
            "compras_por_usuario": compras,
            "metricas": metricas,
        }

        joblib.dump(bundle, MODEL_PATH)
        _cache["bundle"] = bundle
        print(f"[TRAINER] Modelo entrenado {bundle['entrenado_en']} — {metricas}")
        return bundle


def cargar_bundle() -> dict:
    """Devuelve el bundle en memoria; lo carga de disco o entrena si no existe."""
    if _cache["bundle"] is not None:
        return _cache["bundle"]
    if os.path.exists(MODEL_PATH):
        try:
            _cache["bundle"] = joblib.load(MODEL_PATH)
            return _cache["bundle"]
        except Exception as e:
            print(f"[TRAINER] No se pudo cargar el modelo persistido: {e}. Reentrenando.")
    return entrenar_todo()
