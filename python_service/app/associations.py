"""Reglas de asociación para productos complementarios (Apriori / mlxtend).

Cada pedido es una "canasta" de productos. Apriori encuentra conjuntos
frecuentes y association_rules deriva reglas del tipo:
    {laptop} -> {mouse, licencia}
que se usan para sugerir complementos.
"""
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

ESTADOS_COMPRA = ("PAGADO", "ENTREGADO")

_COLS = ["antecedents", "consequents", "support", "confidence", "lift"]


def entrenar(pedidos: pd.DataFrame, detalle: pd.DataFrame,
             min_support: float = 0.05, min_confidence: float = 0.1) -> pd.DataFrame:
    """Genera el DataFrame de reglas de asociación (vacío si no hay señal suficiente)."""
    vacio = pd.DataFrame(columns=_COLS)

    ped_ok = set(pedidos[pedidos["estado"].isin(ESTADOS_COMPRA)]["id_pedido"])
    d = detalle[detalle["id_pedido"].isin(ped_ok)]
    if d.empty:
        return vacio

    # Canastas: lista de productos por pedido (solo pedidos con 2+ productos aportan reglas).
    canastas = (
        d.groupby("id_pedido")["id_producto"]
        .apply(lambda s: sorted({int(x) for x in s}))
        .tolist()
    )
    canastas = [c for c in canastas if len(c) >= 1]
    if len([c for c in canastas if len(c) >= 2]) < 1 or len(canastas) < 2:
        return vacio

    te = TransactionEncoder()
    arr = te.fit_transform(canastas)
    df = pd.DataFrame(arr, columns=te.columns_)

    frecuentes = apriori(df, min_support=min_support, use_colnames=True)
    if frecuentes.empty or (frecuentes["itemsets"].apply(len) >= 2).sum() == 0:
        return vacio

    try:
        reglas = association_rules(frecuentes, metric="confidence", min_threshold=min_confidence)
    except Exception:
        return vacio
    if reglas.empty:
        return vacio

    reglas = reglas.sort_values(["confidence", "lift"], ascending=False).reset_index(drop=True)
    return reglas[_COLS]


def complementos(reglas: pd.DataFrame, product_id: int, limit: int = 4):
    """Productos complementarios de `product_id` según las reglas.

    Devuelve [(id_producto, confidence), ...] ordenado por confianza.
    """
    if reglas is None or reglas.empty:
        return []

    pid = int(product_id)
    vistos, out = set(), []
    for _, row in reglas.iterrows():
        ant = set(int(x) for x in row["antecedents"])
        if pid not in ant:
            continue
        for cons in row["consequents"]:
            c = int(cons)
            if c == pid or c in vistos:
                continue
            vistos.add(c)
            out.append((c, float(row["confidence"])))
            if len(out) >= limit:
                return out
    return out
