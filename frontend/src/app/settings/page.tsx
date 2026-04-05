'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    postLength: 'medium',
    regularity: 'weekly',
    tone: 'professional'
  });

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Ajustes de Publicación</h1>

      <div className="glass-card p-10 flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold border-b border-white border-opacity-10 pb-2">Parámetros de Contenido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-400">Longitud del Post</label>
              <select 
                value={settings.postLength}
                onChange={(e) => setSettings({...settings, postLength: e.target.value})}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="short">Corto (300-500 palabras)</option>
                <option value="medium">Medio (800-1000 palabras)</option>
                <option value="long">Largo (+1500 palabras)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-neutral-400">Tono de Redacción</label>
              <select 
                value={settings.tone}
                onChange={(e) => setSettings({...settings, tone: e.target.value})}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="professional">Profesional</option>
                <option value="creative">Creativo / Narrativo</option>
                <option value="tutorial">Educativo / Tutorial</option>
                <option value="minimalist">Minimalista</option>
              </select>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold border-b border-white border-opacity-10 pb-2">Programación Automática</h2>
          <div className="flex flex-col gap-2">
            <label className="text-neutral-400">Frecuencia de Posteos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Diario', 'Semanal', 'Bisemanal', 'Mensual'].map((freq) => (
                <button 
                  key={freq}
                  onClick={() => setSettings({...settings, regularity: freq.toLowerCase()})}
                  className={`py-3 rounded-xl border transition-all ${settings.regularity === freq.toLowerCase() ? 'border-purple-500 bg-purple-500 bg-opacity-20 text-white' : 'border-white border-opacity-10 text-neutral-400 hover:border-white hover:border-opacity-20'}`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button className="btn-primary mt-4 py-4 text-lg">
          Guardar Ajustes
        </button>
      </div>
    </div>
  );
}
