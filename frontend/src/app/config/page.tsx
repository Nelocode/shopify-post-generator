'use client';

import React, { useState, useEffect } from 'react';

export default function ConfigPage() {
  const [config, setConfig] = useState({
    shop_url: '',
    access_token: '',
    ai_api_key: '',
  });

  useEffect(() => {
    // Cargar config actual al iniciar
    fetch(`/api/config`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No config yet');
      })
      .then(data => {
        if (data) setConfig({
          shop_url: data.shop_url || '',
          access_token: data.access_token || '',
          ai_api_key: data.ai_api_key || ''
        });
      })
      .catch(err => console.log('Sin configuración previa detectada.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        alert("¡Configuración guardada en la base de datos con éxito! Ya no dependes de las variables de entorno.");
      } else {
        alert("Error al guardar la configuración.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Configuración de Conexión</h1>
      
      <form onSubmit={handleSubmit} className="glass-card p-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 font-medium">Shopify Store URL</label>
          <input 
            type="text" 
            placeholder="ejemplo.myshopify.com"
            className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            value={config.shop_url}
            onChange={(e) => setConfig({...config, shop_url: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 font-medium">Shopify Access Token (shpat_...)</label>
          <input 
            type="password" 
            placeholder="Introduce tu token"
            className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            value={config.access_token}
            onChange={(e) => setConfig({...config, access_token: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 font-medium">OpenAI API Key</label>
          <input 
            type="password" 
            placeholder="sk-..."
            className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            value={config.ai_api_key}
            onChange={(e) => setConfig({...config, ai_api_key: e.target.value})}
          />
        </div>

        <button type="submit" className="btn-primary mt-4 py-4 text-lg">
          Guardar Configuración
        </button>
      </form>
      
      <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-20 rounded-xl p-6 text-blue-300 text-sm">
        💡 Asegúrate de que el token de Shopify tenga permisos de <b>Escritura</b> y <b>Lectura</b> en el contenido del blog.
      </div>
    </div>
  );
}
