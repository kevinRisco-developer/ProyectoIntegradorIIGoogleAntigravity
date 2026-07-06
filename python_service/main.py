"""ImportSmart AI Recommender — servicio FastAPI.

Motor de recomendaciones basado en comportamiento:
  - Pipeline pandas (marca/categoría/precio)
  - Filtrado colaborativo (scikit-learn) persistido con joblib
  - Reglas de asociación Apriori (mlxtend) para complementos
  - Reentrenamiento automático cada 12h (APScheduler)
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import recomendar
from app.scheduler import iniciar_scheduler, detener_scheduler
from app.trainer import cargar_bundle


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: asegura un modelo entrenado y arranca el reentrenamiento programado.
    try:
        cargar_bundle()
    except Exception as e:
        print(f"[STARTUP] No se pudo entrenar/cargar el modelo al inicio: {e}")
    iniciar_scheduler()
    yield
    # Shutdown
    detener_scheduler()


app = FastAPI(title="ImportSmart AI Recommender", version="2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recomendar.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
