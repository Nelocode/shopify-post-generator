# Dockerfile de la raíz (opcional para redirigir a Easypanel)
# Este archivo es un respaldo. Lo ideal es usar el docker-compose.yml
# Pero si se usa como App única, por defecto levantaremos el Backend.

FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
