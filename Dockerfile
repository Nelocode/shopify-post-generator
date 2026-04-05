FROM nikolaik/python-nodejs:python3.10-nodejs18-slim

WORKDIR /app

# 1. Instalar dependencias del backend
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# 2. Instalar dependencias del frontend y construirlo
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 3. Copiar el código del backend y el script de inicio
COPY backend/ ./backend/
COPY start.sh ./
RUN chmod +x start.sh

# 4. Exponer únicamente el puerto del Frontend. 
# El frontend accederá al backend de forma local.
EXPOSE 3000

CMD ["./start.sh"]
