import os
from fastapi import FastAPI, Query
import pandas as pd
import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
import numpy as np
from dotenv import load_dotenv

load_dotenv() # Cargar variables desde .env

app = FastAPI(title="ImportSmart AI Recommender")

# Database Connection Helper (Read-Only as requested)
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "usuario"),
        password=os.getenv("DB_PASS", "password"),
        database=os.getenv("DB_NAME", "ecommerce_db")
    )



@app.get("/")
def read_root():
    return {"status": "AI Service Running", "engine": "FastAPI + Scikit-Learn"}

@app.get("/recommend/{user_id}")
def get_recommendations(user_id: int, limit: int = 4):
    try:
        conn = get_db_connection()
        
        # 1. Load Data with Order by Date to respect recency
        df_products = pd.read_sql("SELECT id_producto, nombre, descripcion, id_categoria FROM producto", conn)
        df_orders = pd.read_sql("""
            SELECT p.id_usuario, dp.id_producto, p.fecha 
            FROM pedido p 
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido 
            WHERE p.id_usuario = %s
            ORDER BY p.fecha DESC
        """, conn, params=[user_id])
        
        # Get user's purchased products (Ordered by recent first)
        user_purchases = []
        if not df_orders.empty:
            # Mantener orden cronológico inverso
            user_purchases = [int(x) for x in df_orders['id_producto'].unique()]
        
        print(f"DEBUG RECIENTES: Usuario {user_id} -> {user_purchases}")
        
        if not user_purchases:
            return df_products.head(limit)['id_producto'].tolist()

        #--- A. CONTENT-BASED FILTERING (Scoring Logic) ---
        df_products['features'] = df_products['nombre'] + " " + df_products['descripcion'].fillna('')
        tfidf = TfidfVectorizer(stop_words=None)
        tfidf_matrix = tfidf.fit_transform(df_products['features'])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        indices = pd.Series(df_products.index, index=df_products['id_producto']).drop_duplicates()
        
        # Inicializar puntuaciones
        df_products['score'] = 0.0
        
        # 1. BOOST POR LA CATEGORÍA MÁS RECIENTE
        # Buscamos la categoría del último producto comprado
        last_pid = user_purchases[0]
        last_cat = df_products[df_products['id_producto'] == last_pid]['id_categoria'].values[0]
        
        # Aplicamos un boost masivo a la misma categoría del último producto
        df_products.loc[df_products['id_categoria'] == last_cat, 'score'] += 2.0
        print(f"DEBUG: Aplicando boost masivo a categoría reciente: {last_cat}")

        # 2. ACUMULAR SIMILITUD CON PESO DE RECENCIA
        for i, pid in enumerate(user_purchases[:5]): # Analizar solo las últimas 5 compras para no saturar
            if pid in indices:
                idx = indices[pid]
                sim_scores = cosine_sim[idx]
                # Peso decreciente: 1.0, 0.8, 0.6...
                weight = max(0.2, 1.0 - (i * 0.2))
                df_products['score'] += sim_scores * weight

        # 3. FILTRAR COMPRADOS Y ORDENAR
        # Ponemos score -1 a los ya comprados para que nunca salgan
        df_products.loc[df_products['id_producto'].isin(user_purchases), 'score'] = -1.0
        
        final_recs = df_products.sort_values(by='score', ascending=False)
        content_results = final_recs[final_recs['score'] > 0]['id_producto'].head(limit).tolist()

        #--- B. COLLABORATIVE FILTERING (BASIC) ---
        # Solo lo usamos si nos faltan recomendaciones o para mezclar
        similar_users = df_orders[df_orders['id_producto'].isin(user_purchases[:3])]['id_usuario'].unique()
        
        #--- C. FINAL RESULTS ---
        conn.close()
        return [int(x) for x in content_results[:limit]]
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
