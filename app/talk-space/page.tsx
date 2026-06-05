'use client'; // Diperlukan untuk interaksi seperti state/input

import { useState } from 'react';

export default function TalkSpace() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Halo teman-teman, apakah materi hari ini jelas?" },
    { id: 2, sender: "Budi (Tunarungu)", text: "Halo Naila! Ya, videonya sangat membantu." }
  ]);

  return (
    <main className="min-h-screen bg-slate-950 p-6 flex flex-col max-w-4xl mx-auto text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Talk Space: Ruang Komunikasi Inklusif</h1>

      {/* Area Chat - Sama untuk semua */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-6 border border-indigo-800 mb-6 overflow-y-auto h-96">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-indigo-400 font-bold mb-1">{msg.sender}</p>
            <p className="text-lg">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Area (Hybrid) - Adaptif untuk keduanya */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Input Teks (Fokus utama untuk Tunarungu) */}
        <input 
          className="flex-1 bg-slate-800 p-4 rounded-2xl border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Ketik pesan atau gunakan mikrofon..." 
        />
        
        {/* Tombol Rekam/Suara (Fokus utama untuk Tunanetra) */}
        <button className="bg-teal-600 px-8 py-4 rounded-2xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/50 flex items-center justify-center gap-2">
          <span>🎙️</span> Mulai Rekam Suara
        </button>
      </div>
    </main>
  );
}