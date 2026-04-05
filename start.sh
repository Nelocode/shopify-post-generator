#!/bin/sh

# Start FastAPI backend in the background
echo "Starting FastAPI backend..."
cd /app/backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 &

# Start Next.js frontend in the foreground
echo "Starting Next.js frontend..."
cd /app/frontend
npm start -- -p 3000
