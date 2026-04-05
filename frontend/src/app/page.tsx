'use client';

import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resumen del Sistema</h1>
        <button className="btn-primary">Ejecutar Ahora</button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-neutral-400">Total Posts Generados</span>
          <span className="text-4xl font-bold">0</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-neutral-400">Temas Pendientes</span>
          <span className="text-4xl font-bold">0</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-neutral-400">Estado Shopify</span>
          <span className="text-xl font-semibold text-green-400 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            Conectado
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold mb-6">Actividad Reciente</h2>
        <div className="text-neutral-500 text-center py-12">
          No hay actividad registrada aún. Comienza configurando tus temas.
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 hover:bg-white hover:bg-opacity-5 transition shadow-sm cursor-pointer">
          <h3 className="font-bold text-lg">Añadir Temas</h3>
          <p className="text-sm text-neutral-400">Ingresa nuevas ideas para posts de blog bilingües.</p>
        </div>
        <div className="glass-card p-6 hover:bg-white hover:bg-opacity-5 transition shadow-sm cursor-pointer">
          <h3 className="font-bold text-lg">Configurar IA</h3>
          <p className="text-sm text-neutral-400">Ajusta los modelos de GPT y DALL-E para tu contenido.</p>
        </div>
      </div>
    </div>
  );
}
