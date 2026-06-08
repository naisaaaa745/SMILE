'use client';
import { useState } from 'react';

export default function TalkSpace() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Halo teman-teman, apakah materi hari ini jelas?" },
    { id: 2, sender: "Budi (Tunarungu)", text: "Halo Naila! Ya, videonya sangat membantu." }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Fungsi Kirim Teks ke Backend Flask
  const handleSendMessage = async (textToSend: string = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Tambahkan pesan user ke daftar chat
    const userMsg = { id: Date.now(), sender: "Anda", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    try {
      // Kirim input ke backend STT Flask
      const res = await fetch('http://localhost:5000/api/talkspace/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const botMsg = { id: Date.now() + 1, sender: "Asisten SMILE", text: data.reply };
        setMessages(prev => [...prev, botMsg]);

        // Putar audio panduan secara otomatis menggunakan TTS
        const ttsRes = await fetch('http://localhost:5000/api/talkspace/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.reply })
        });
        const ttsData = await ttsRes.json();
        if (ttsRes.ok && ttsData.audio_url) {
          const audio = new Audio(ttsData.audio_url);
          audio.play().catch(e => console.error("Playback failed:", e));
        }
      }
    } catch (err) {
      console.error("Gagal menghubungi backend:", err);
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
      handleSendMessage(transcript); // Kirim ucapan secara langsung ke backend
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
          onClick={() => handleSendMessage()}
          className="bg-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all"
        >
          Kirim
        </button>
      </div>
    </main>
  );
}