"""Filtrado colaborativo basado en comportamiento (scikit-learn).

Construye la matriz usuario-producto ponderada y calcula:
  - similitud producto-producto (item-item CF)
  - similitud usuario-usuario (user-user CF)
mediante similitud del coseno. El modelo se persiste con joblib (ver trainer).
"""
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


def entrenar(inter: pd.DataFrame):
    """Devuelve el modelo colaborativo o None si no hay interacciones."""
    if inter is None or inter.empty:
        return None

    # Matriz usuario (filas) x producto (columnas), valores = peso de interacción.
    pivot = inter.pivot_table(
        index="id_usuario", columns="id_producto", values="peso", fill_value=0.0
    )

    user_item = pivot.values.astype(float)          # (n_users, n_items)
    item_user = user_item.T                          # (n_items, n_users)

    # Similitud coseno. Con una sola fila/col, cosine_similarity devuelve [[1.]].
    item_sim = cosine_similarity(item_user) if item_user.shape[0] > 0 else np.zeros((0, 0))
    user_sim = cosine_similarity(user_item) if user_item.shape[0] > 0 else np.zeros((0, 0))

    popularidad = inter.groupby("id_producto")["peso"].sum()

    return {
        "user_index": [int(u) for u in pivot.index],      # orden de usuarios
        "item_index": [int(p) for p in pivot.columns],    # orden de productos
        "user_item": user_item,                            # (n_users, n_items)
        "item_sim": item_sim,                              # (n_items, n_items)
        "user_sim": user_sim,                              # (n_users, n_users)
        "popularidad": {int(k): float(v) for k, v in popularidad.items()},
    }
