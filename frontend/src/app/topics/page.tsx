'use client';

import React, { useState, useEffect } from 'react';

export default function TopicsPage() {
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<any[]>([]);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/topics`);
      if (res.ok) setTopics(await res.json());
    } catch(err) { console.error("Error cargando temas", err); }
  };

  useEffect(() => { fetchTopics(); }, []);

  const addTopic = async () => {
    if (!newTopic) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ theme: newTopic }])
      });
      if (res.ok) {
        setNewTopic("");
        fetchTopics();
      } else {
        alert("Asegúrate de haber guardado la configuración en la pestaña 'Configuración' primero.");
      }
    } catch(err) { alert("Error añadiendo el tema."); }
  };

  const generateDraft = async (topicId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/generate-draft/${topicId}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert("¡Generación iniciada en segundo plano! Revisa Shopify en unos minutos.");
      } else {
        alert("Error al iniciar generación.");
      }
    } catch(err) { alert("Fallo de conexión."); }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Gestión de Temas</h1>

      {/* Add Topic Bar */}
      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Escribe un tema o palabra clave..."
          className="flex-1 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <button onClick={addTopic} className="btn-primary px-8">Añadir</button>
      </div>

      {/* Topics List */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white bg-opacity-5 border-b border-white border-opacity-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Tema / Palabra Clave</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition">
                <td className="px-6 py-4">{topic.theme}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${topic.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {topic.status === 'completed' ? 'completado' : 'pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => generateDraft(topic.id)} className="text-blue-400 hover:underline text-sm mr-4">Generar</button>
                  <button className="text-red-400 hover:underline text-sm">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
