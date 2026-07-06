"""Pipeline de datos con pandas: extracción y limpieza del historial de
comportamiento, y construcción de la matriz de interacciones usuario-producto.

Agrupa cada producto visto o comprado por MARCA, CATEGORÍA y PRECIO (banda),
que es la base de los perfiles de usuario para el scoring por afinidad.
"""
import pandas as pd
from sqlalchemy import text

# ---------------------------------------------------------------------------
# Normalización de acciones y pesos de comportamiento
# ---------------------------------------------------------------------------
# El historial mezcla convenciones: datos antiguos en español (vista/agregado/
# compra) y datos nuevos del frontend en inglés (VIEW/CLICK/ADD_CART/PURCHASE).
ACCION_MAP = {
    "vista": "VIEW", "view": "VIEW", "ver": "VIEW", "stay": "VIEW", "visualizacion": "VIEW",
    "clic": "CLICK", "click": "CLICK",
    "agregado": "ADD_CART", "add_cart": "ADD_CART", "carrito": "ADD_CART", "agregar": "ADD_CART",
    "compra": "PURCHASE", "purchase": "PURCHASE", "comprado": "PURCHASE", "buy": "PURCHASE",
}

# Peso de cada señal. La compra es la señal más fuerte.
PESOS = {"VIEW": 1.0, "CLICK": 0.5, "ADD_CART": 3.0, "PURCHASE": 5.0}

# Estados de pedido que cuentan como compra efectiva.
ESTADOS_COMPRA = ("PAGADO", "ENTREGADO")


def normalizar_accion(a):
    if a is None:
        return None
    return ACCION_MAP.get(str(a).strip().lower())


# ---------------------------------------------------------------------------
# Extracción
# ---------------------------------------------------------------------------
def cargar_datos(engine):
    """Lee las tablas necesarias en DataFrames de pandas."""
    with engine.connect() as conn:
        productos = pd.read_sql(text(
            "SELECT id_producto, nombre, descripcion, precio, id_categoria, marca, estado "
            "FROM producto"), conn)
        historial = pd.read_sql(text(
            "SELECT id_usuario, id_producto, accion, permanencia, fecha FROM historial"), conn)
        pedidos = pd.read_sql(text(
            "SELECT id_pedido, id_usuario, estado, fecha FROM pedido"), conn)
        detalle = pd.read_sql(text(
            "SELECT id_pedido, id_producto, cantidad FROM detalle_pedido"), conn)
    return productos, historial, pedidos, detalle


# ---------------------------------------------------------------------------
# Limpieza
# ---------------------------------------------------------------------------
def limpiar_productos(productos: pd.DataFrame) -> pd.DataFrame:
    """Normaliza tipos, rellena nulos y calcula la banda de precio (terciles)."""
    p = productos.copy()
    p["marca"] = p["marca"].fillna("Generico").astype(str).str.strip().replace("", "Generico")
    p["descripcion"] = p["descripcion"].fillna("")
    p["nombre"] = p["nombre"].fillna("")
    p["precio"] = pd.to_numeric(p["precio"], errors="coerce").fillna(0.0)
    p["id_categoria"] = pd.to_numeric(p["id_categoria"], errors="coerce").fillna(0).astype(int)
    p["id_producto"] = p["id_producto"].astype(int)

    # Banda de precio: economico / medio / premium por terciles.
    try:
        p["banda_precio"] = pd.qcut(
            p["precio"], q=3, labels=["economico", "medio", "premium"], duplicates="drop"
        ).astype(str)
    except Exception:
        p["banda_precio"] = "medio"
    p["banda_precio"] = p["banda_precio"].replace("nan", "medio")
    return p


# ---------------------------------------------------------------------------
# Interacciones usuario-producto (comportamiento + compras)
# ---------------------------------------------------------------------------
def construir_interacciones(historial, pedidos, detalle) -> pd.DataFrame:
    """Matriz larga [id_usuario, id_producto, peso].

    - Comportamiento (VIEW/CLICK/ADD_CART) desde `historial`.
    - Compras (PURCHASE) desde `detalle_pedido` (fuente autoritativa, incluye
      compras previas al sprint). Se IGNORAN las filas PURCHASE del historial
      para no contar la compra dos veces.
    - Dedupe por usuario+producto tomando el peso máximo.
    """
    # Comportamiento (sin compras)
    h = historial.copy()
    h["accion_norm"] = h["accion"].map(normalizar_accion)
    h = h.dropna(subset=["accion_norm", "id_usuario", "id_producto"])
    h = h[h["accion_norm"] != "PURCHASE"]
    h["peso"] = h["accion_norm"].map(PESOS)
    comportamiento = h[["id_usuario", "id_producto", "peso"]]

    # Compras efectivas
    compras = _compras_largas(pedidos, detalle)
    compras = compras.assign(peso=PESOS["PURCHASE"])[["id_usuario", "id_producto", "peso"]]

    inter = pd.concat([comportamiento, compras], ignore_index=True)
    inter = inter.dropna(subset=["id_usuario", "id_producto"])
    if inter.empty:
        return inter
    inter["id_usuario"] = inter["id_usuario"].astype(int)
    inter["id_producto"] = inter["id_producto"].astype(int)
    inter = inter.groupby(["id_usuario", "id_producto"], as_index=False)["peso"].max()
    return inter


def _compras_largas(pedidos, detalle) -> pd.DataFrame:
    ped = pedidos[pedidos["estado"].isin(ESTADOS_COMPRA)][["id_pedido", "id_usuario"]]
    d = detalle.merge(ped, on="id_pedido", how="inner")
    return d[["id_usuario", "id_producto"]].dropna()


def compras_por_usuario(pedidos, detalle) -> dict:
    """{id_usuario: [id_producto, ...]} de compras efectivas (para excluir de las recs)."""
    d = _compras_largas(pedidos, detalle)
    out = {}
    for uid, grp in d.groupby("id_usuario"):
        out[int(uid)] = sorted(set(int(x) for x in grp["id_producto"]))
    return out


# ---------------------------------------------------------------------------
# Perfiles de usuario: agrupación por marca / categoría / banda de precio
# ---------------------------------------------------------------------------
def perfiles_usuario(inter: pd.DataFrame, productos: pd.DataFrame) -> dict:
    """Suma de pesos por (usuario, marca), (usuario, categoría) y (usuario, banda).

    Representa la afinidad del usuario a cada marca/categoría/rango de precio,
    calculada sobre todo lo que vio o compró.
    """
    if inter.empty:
        vacio = pd.DataFrame(columns=["id_usuario"])
        return {"marca": vacio, "categoria": vacio, "banda": vacio}

    df = inter.merge(
        productos[["id_producto", "marca", "id_categoria", "banda_precio"]],
        on="id_producto", how="left",
    )
    perfil_marca = df.groupby(["id_usuario", "marca"])["peso"].sum().reset_index()
    perfil_cat = df.groupby(["id_usuario", "id_categoria"])["peso"].sum().reset_index()
    perfil_banda = df.groupby(["id_usuario", "banda_precio"])["peso"].sum().reset_index()
    return {"marca": perfil_marca, "categoria": perfil_cat, "banda": perfil_banda}
