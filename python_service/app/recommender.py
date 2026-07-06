"""Motor de recomendación: combina las señales entrenadas para un usuario.

Blend:
  1. Colaborativo  = 0.6 * item-item CF + 0.4 * user-user CF
  2. Perfil        = afinidad a la marca / categoría / banda de precio del producto
  3. Complementos  = boost Apriori sobre lo que el usuario compró/agregó
Excluye lo ya comprado. Si el usuario no tiene señal, cae a popularidad.
"""
import numpy as np

from . import trainer, associations

# Pesos del blend final.
W_CF = 0.55
W_PERFIL = 0.30
W_COMPLEMENTO = 0.15


def _meta_index(bundle):
    return {int(p["id_producto"]): p for p in bundle["productos"]}


def _norm(x: np.ndarray) -> np.ndarray:
    x = np.asarray(x, dtype=float)
    m = x.max() if x.size else 0.0
    return x / m if m > 0 else x


def _perfil_usuario(bundle, user_id):
    """Devuelve dicts de afinidad normalizada por marca/categoría/banda."""
    def _map(records, key):
        d = {}
        for r in records:
            if int(r["id_usuario"]) == int(user_id):
                d[r[key]] = d.get(r[key], 0.0) + float(r["peso"])
        mx = max(d.values()) if d else 0.0
        return {k: (v / mx if mx > 0 else 0.0) for k, v in d.items()}

    perfiles = bundle.get("perfiles", {})
    return (
        _map(perfiles.get("marca", []), "marca"),
        _map(perfiles.get("categoria", []), "id_categoria"),
        _map(perfiles.get("banda", []), "banda_precio"),
    )


def recomendar_usuario(user_id: int, limit: int = 6):
    bundle = trainer.cargar_bundle()
    meta = _meta_index(bundle)
    todos = list(meta.keys())
    if not todos:
        return [], bundle.get("entrenado_en")

    compras = bundle.get("compras_por_usuario", {})
    ya_compro = set(compras.get(int(user_id), compras.get(str(user_id), [])))

    cf = bundle.get("cf")
    scores = {pid: 0.0 for pid in todos}
    origen = {pid: "popularidad" for pid in todos}

    # -- 1. Colaborativo (si el usuario está en la matriz) --------------------
    tiene_cf = bool(cf) and int(user_id) in cf["user_index"]
    if tiene_cf:
        items = cf["item_index"]
        uidx = cf["user_index"].index(int(user_id))
        user_item = np.asarray(cf["user_item"], dtype=float)
        item_sim = np.asarray(cf["item_sim"], dtype=float)
        user_sim = np.asarray(cf["user_sim"], dtype=float)

        u = user_item[uidx]                    # vector del usuario sobre items
        s_item = item_sim.dot(u)               # item-item
        s_user = user_sim[uidx].dot(user_item) # user-user
        s_cf = _norm(0.6 * _norm(s_item) + 0.4 * _norm(s_user))
        for i, pid in enumerate(items):
            if pid in scores:
                scores[pid] += W_CF * float(s_cf[i])
                if s_cf[i] > 0:
                    origen[pid] = "colaborativo"

    # -- 2. Perfil marca / categoría / precio ---------------------------------
    af_marca, af_cat, af_banda = _perfil_usuario(bundle, user_id)
    if af_marca or af_cat or af_banda:
        for pid in todos:
            p = meta[pid]
            s = (af_marca.get(p.get("marca"), 0.0)
                 + af_cat.get(p.get("id_categoria"), 0.0)
                 + af_banda.get(p.get("banda_precio"), 0.0)) / 3.0
            if s > 0:
                scores[pid] += W_PERFIL * s
                if not tiene_cf or origen[pid] == "popularidad":
                    origen[pid] = "perfil"

    # -- 3. Complementos (Apriori) sobre compras/carrito del usuario ----------
    reglas = bundle.get("reglas")
    for base_pid in ya_compro:
        for comp_pid, conf in associations.complementos(reglas, base_pid, limit=limit):
            if comp_pid in scores:
                scores[comp_pid] += W_COMPLEMENTO * float(conf)
                if scores[comp_pid] == W_COMPLEMENTO * float(conf):
                    origen[comp_pid] = "complemento"

    # -- 4. Excluir comprados y ordenar ---------------------------------------
    candidatos = [(pid, sc) for pid, sc in scores.items() if pid not in ya_compro]
    con_score = [c for c in candidatos if c[1] > 0]

    if con_score:
        con_score.sort(key=lambda x: x[1], reverse=True)
        elegidos = con_score[:limit]
    else:
        # Fallback: popularidad global normalizada como score (0..1).
        pop = (cf or {}).get("popularidad", {})
        candidatos.sort(key=lambda x: pop.get(x[0], 0.0), reverse=True)
        top = candidatos[:limit]
        max_pop = max((pop.get(pid, 0.0) for pid, _ in top), default=0.0)
        elegidos = [(pid, (pop.get(pid, 0.0) / max_pop) if max_pop > 0 else 0.0) for pid, _ in top]
        origen = {pid: "popularidad" for pid, _ in elegidos}

    return [_item(meta[pid], sc, origen.get(pid, "popularidad")) for pid, sc in elegidos], \
        bundle.get("entrenado_en")


def complementarios_producto(product_id: int, limit: int = 4):
    """Productos frecuentemente comprados junto a `product_id` (Apriori)."""
    bundle = trainer.cargar_bundle()
    meta = _meta_index(bundle)
    reglas = bundle.get("reglas")
    pares = associations.complementos(reglas, product_id, limit=limit)
    items = [_item(meta[pid], conf, "complemento") for pid, conf in pares if pid in meta]
    return items, bundle.get("entrenado_en")


def _item(p, score, origen):
    return {
        "id_producto": int(p["id_producto"]),
        "nombre": p.get("nombre"),
        "marca": p.get("marca"),
        "id_categoria": int(p["id_categoria"]) if p.get("id_categoria") is not None else None,
        "precio": float(p["precio"]) if p.get("precio") is not None else None,
        "score": round(float(score), 4),
        "origen": origen,
    }
