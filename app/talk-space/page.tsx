'use client';
import { useState, useEffect } from 'react';

export default function TalkSpace() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Halo teman-teman, apakah materi hari ini jelas?" },
    { id: 2, sender: "Budi (Tunarungu)", text: "Halo Naila! Ya, videonya sangat membantu." }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Fungsi Kirim Teks
  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      const newMsg = { id: Date.now(), sender: "Anda", text: inputText };
      setMessages([...messages, newMsg]);
      setInputText("");
    }
  };

  // Fungsi Rekam Suara (Speech-to-Text)
  const startRecording = () => {
    // Cek apakah browser mendukung SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Maaf, browser kamu tidak mendukung fitur rekaman suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript); // Hasil suara otomatis masuk ke kotak input
    };

    recognition.start();
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 flex flex-col max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Talk Space: Ruang Komunikasi Inklusif</h1>

      {/* Area Chat */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-6 border border-indigo-800 mb-6 overflow-y-auto h-96">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-indigo-400 font-bold mb-1">{msg.sender}</p>
            <p className="text-lg">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex flex-col md:flex-row gap-4">
        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-800 p-4 rounded-2xl border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Ketik pesan atau klik tombol rekam..." 
        />
        
        {/* Tombol Rekam */}
        <button 
          onClick={startRecording}
          className={`px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-teal-600 hover:bg-teal-500'
          }`}
        >
          <span>🎙️</span> {isRecording ? "Mendengarkan..." : "Rekam Suara"}
        </button>

        {/* Tombol Kirim */}
        <button 
          onClick={handleSendMessage}
          className="bg-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all"
        >
          Kirim
        </button>
      </div>
    </main>
  );
}