'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TalkSpace() {
  // State dengan pesan yang sudah sesuai materi Cuaca Ekstrem
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Apakah ada instruksi jika terjadi hujan lebat terus menerus?", type: "voice" },
    { id: 2, sender: "Budi (Tunarungu)", text: "[Isyarat Terdeteksi: Hujan Lebat]", type: "sign" }
  ]);

  const [inputText, setInputText] = useState("");

  // Fungsi Kirim Pesan
  const handleSendMessage = (textToSend: string, type: string) => {
    if (!textToSend.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Anda",
      text: type === "sign" ? `[Isyarat Terdeteksi: ${textToSend}]` : textToSend,
      type
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 flex flex-col max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Talk Space: Ruang Kolaborasi Inklusif</h1>

      {/* Area Chat */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-6 border border-indigo-800 mb-6 overflow-y-auto h-96">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-indigo-400 font-bold">{msg.sender}</p>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full uppercase">
                {msg.type === 'voice' ? '🎙️ Suara' : msg.type === 'sign' ? '🤟 Isyarat' : '📝 Teks'}
              </span>
            </div>
            <p className="text-lg mb-3">{msg.text}</p>

            {/* Tombol Aksi Simulasi */}
            <button className="text-[10px] bg-teal-900/50 text-teal-300 px-2 py-1 rounded border border-teal-500 hover:bg-teal-800 transition-all">
              {msg.type === 'voice' ? 'Terjemahkan ke Isyarat' : 'Terjemahkan ke Teks/Suara'}
            </button>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-4">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full bg-slate-800 p-4 rounded-2xl border border-indigo-500 focus:outline-none"
          placeholder="Ketik pesan..."
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleSendMessage(inputText, "text")}
            className="flex-1 bg-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all"
          >
            Kirim Teks
          </button>

          <button className="flex-1 bg-teal-600 py-4 rounded-2xl font-bold hover:bg-teal-500 transition-all">
            🎙️ Kirim Suara
          </button>

          {/* Tombol ini akan membawa ke halaman tunarungu untuk deteksi isyarat */}
          <Link href="/tunarungu" className="flex-1 bg-rose-600 py-4 rounded-2xl font-bold hover:bg-rose-500 transition-all text-center">
            🤟 Kirim Isyarat
          </Link>
        </div>
      </div>
    </main>
  );
}