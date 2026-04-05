# Shopify AI Content Generator - Handover & Status Report

## 🚀 Resumen Ejecutivo
Sistema autónomo bilingüe para la creación de artículos de blog en Shopify, orquestado a través de FastAPI y gobernado por un Dashboard de Next.js. El flujo integra redacción mediante **GPT-4o** y generación de imágenes mediante **DALL-E 3**. 

## 🏗️ Estado Actual (5 de abril de 2026)
- **Frontend (Next.js 15 + Tailwind v4)**: Desplegado y estable. Migrado exitosamente para cumplir con Tailwind v4 sin directivas `@apply` conflictivas. Rutas configuradas para conectar al backend vía prefijo `/api`.
- **Backend (FastAPI)**: Procesos e hilos asíncronos configurados correctamente (`BackgroundTasks`). Genera y sube los posts a Shopify.
- **Despliegue (Easypanel)**: Resuelto. Se utiliza un único contenedor Docker (`nikolaik/python-nodejs:python3.10-nodejs20-slim`) ejecutado desde el archivo `start.sh`. El frontend escucha por el puerto público `3000`, y rutea el tráfico necesario al puerto `8000` internamente.
- **Base de Datos**: Modelos SQLite nativos para almacenar tópicos, preferencias (tonos y largo) y llaves API (OpenAI y Shopify Access Token) con el objetivo de funcionar "Out-of-the-box" sin variables de entorno adicionales.

## 🎯 Hitos Completados
1. Generación de posts de alta calidad y subida automatizada a Shopify como borradores (`published: false`).
2. Funcionalidad Bilingüe: El backend detecta y publica el post en español en el blog de **Noticias** y el equivalente en inglés en el blog de **News**.
3. Consolidación de credenciales en el Dashboard (elimina dependencia del archivo `.env`).
4. Reescritura del proxy de Next.js local (rewrites en `next.config.mjs`/`ts`) para comunicarse transparentemente con FastAPI bajo el mismo origen.

## ⏸️ Siguientes pasos al retomar el proyecto
1. **Verificación de Generación E2E**: Evaluar a fondo el resultado estético y semántico del borrador generado tanto en la vertiente español como inglés analizando los atributos en el administrador de Shopify.
2. **Programación Activa / Cronjobs**: Implementar y testear los Jobs de APScheduler para habilitar publicadores semanales/diarios desde la pestaña "Ajustes".
3. **Escalabilidad de DB**: Considerar un cambio a Postgres si la carga de la plataforma crece más allá de pruebas aisladas (actualmente SQLite funciona muy bien en un volumen Easypanel, pero Postgres ofrece más garantías en producción masiva).

## 🪟 Detalles Técnicos Críticos
*   **Next.js v15.x y Node v20+**: Es estrictamente necesario no bajar de la imagen Docker de nodejs20 debido a las rígidas dependencias del backend de NextJS actual.
*   **Estilos y CSS**: Por motivos de PostCSS estricto, el archivo `globals.css` debe mantener estilos transparentes de variables nativas (no se debe re-introducir `@apply` con `/opacity` para utilidades base o fallará el compilador).
*   **Acceso**: El puerto a exponer en Easypanel **debe ser el 3000**.
