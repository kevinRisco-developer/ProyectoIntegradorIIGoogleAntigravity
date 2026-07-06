"""Modelos ORM SQLAlchemy (mapean las tablas existentes en Railway).

Solo se declaran las columnas usadas por el motor de recomendaciones.
La BD ya existe (ddl-auto=none en el backend): NO se crean tablas desde aquí.
"""
from sqlalchemy import Column, Integer, BigInteger, String, Text, Numeric, Float, DateTime, SmallInteger

from .database import Base


class Categoria(Base):
    __tablename__ = "categoria"
    id_categoria = Column(Integer, primary_key=True)
    nombre = Column(String(255))
    estado = Column(SmallInteger)


class Producto(Base):
    __tablename__ = "producto"
    id_producto = Column(Integer, primary_key=True)
    nombre = Column(String(150))
    descripcion = Column(Text)
    precio = Column(Numeric(10, 2))
    stock = Column(Integer)
    id_categoria = Column(Integer)
    imagen_url = Column(Text)
    estado = Column(SmallInteger)
    descuento = Column(Numeric(10, 2))
    marca = Column(String(100))


class Historial(Base):
    __tablename__ = "historial"
    id_historial = Column(BigInteger, primary_key=True)
    id_usuario = Column(Integer)
    id_producto = Column(Integer)
    accion = Column(String(255))
    fecha = Column(DateTime)
    permanencia = Column(Integer)


class Pedido(Base):
    __tablename__ = "pedido"
    id_pedido = Column(Integer, primary_key=True)
    id_usuario = Column(Integer)
    fecha = Column(DateTime)
    estado = Column(String(255))


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"
    id_detalle = Column(BigInteger, primary_key=True)
    id_pedido = Column(Integer)
    id_producto = Column(Integer)
    cantidad = Column(Integer)
    precio = Column(Float)
