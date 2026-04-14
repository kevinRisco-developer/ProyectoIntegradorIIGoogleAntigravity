# ImportSmart: E-commerce con IA Integrada 🚀

Este es un sistema de comercio electrónico avanzado diseñado en una arquitectura de microservicios y servicios distribuidos. El proyecto combina la robustez de **Spring Boot**, la dinamismo de **Angular** y la inteligencia de **Python (FastAPI)** para ofrecer recomendaciones personalizadas en tiempo real.

## 🧱 Estructura del Proyecto

El repositorio está organizado como un Monorepo:

- 📂 `/demo`: Backend principal en Java 17 con Spring Boot. Maneja la lógica de negocio, persistencia en Railway (MySQL) y envíos de correo.
- 📂 `/springangular`: Interfaz de usuario premium construida con Angular 17+ y Tailwind CSS.
- 📂 `/python_service`: Microservicio de Inteligencia Artificial basado en FastAPI, Scikit-Learn y Pandas para procesamiento de recomendaciones híbridas.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular, Tailwind CSS, Material Symbols.
- **Backend Java**: Spring Boot, Spring Security (JWT), Hibernate, Java Mail.
- **IA/Data Science**: Python, FastAPI, Pandas, Scikit-Learn (TF-IDF, Cosine Similarity).
- **Base de Datos**: MySQL (Hospedado en Railway).

## 🚀 Instalación y Configuración

### 1. Requisitos
- JDK 17 o superior.
- Node.js y Angular CLI.
- Python 3.9+ y venv.

### 2. Variables de Entorno (IMPORTANTE)
Para que el sistema funcione correctamente, debes configurar los archivos `.env` basándote en las plantillas proporcionadas:

#### Backend (`/demo/.env`)
Copia `demo/.env.template` a `demo/.env` y completa tus credenciales de DB y Gmail.

#### Python IA (`/python_service/.env`)
Copia `python_service/.env.template` a `python_service/.env` con los datos de conexión a la base de datos.

### 3. Ejecución

- **Backend**: `mvn spring-boot:run` en la carpeta `/demo`.
- **Frontend**: `ng serve` en la carpeta `/springangular`.
- **IA**: `python main.py` dentro de su entorno virtual en `/python_service`.

## 🧠 Características de la IA
El motor de recomendaciones utiliza un enfoque híbrido:
1. **Content-Based**: Analiza descripciones y nombres de productos usando TF-IDF.
2. **Prioridad por Recencia**: Las recomendaciones se ajustan instantáneamente según tu última compra.
3. **Colaborativo**: Sugiere productos basados en el comportamiento de usuarios similares.

---
Generado con ❤️ para el proyecto ImportSmart.
