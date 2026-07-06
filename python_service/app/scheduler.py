"""Reentrenamiento automático en segundo plano (APScheduler).

Un BackgroundScheduler corre el entrenamiento cada RETRAIN_HORAS (12 por
defecto) sin bloquear el endpoint /recomendar.
"""
from apscheduler.schedulers.background import BackgroundScheduler

from .config import RETRAIN_HORAS
from .trainer import entrenar_todo

_scheduler = None


def iniciar_scheduler():
    global _scheduler
    if _scheduler is not None:
        return _scheduler

    scheduler = BackgroundScheduler(daemon=True)
    scheduler.add_job(
        entrenar_todo,
        trigger="interval",
        hours=RETRAIN_HORAS,
        id="reentrenamiento_modelo",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()
    _scheduler = scheduler
    print(f"[SCHEDULER] Reentrenamiento programado cada {RETRAIN_HORAS} horas.")
    return scheduler


def detener_scheduler():
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
