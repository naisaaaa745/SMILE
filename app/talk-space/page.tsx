'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mic, Languages } from 'lucide-react';

export default function TalkSpace() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Apakah ada instruksi jika terjadi hujan lebat terus menerus?", type: "voice" },
    { id: 2, sender: "Budi (Tunarungu)", text: "[Isyarat Terdeteksi: Hujan Lebat]", type: "sign" }
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Auto-Read: Bacakan pesan baru (Inklusif)
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender !== "Anda" && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(lastMsg.text);
      speech.lang = 'id-ID';
      window.speechSynthesis.speak(speech);
    }
  }, [messages]);

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

  const handleKirimSuara = () => {
    setIsListening(true);
    setTimeout(() => {
      handleSendMessage("Saya sedang berlindung di ruang kelas", "voice");
      setIsListening(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm">
          <Link href="/tunanetra" className="flex items-center gap-2 text-indigo-700 font-bold hover:text-indigo-900 transition-colors">
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-xl font-black text-indigo-900">Talk Space Inklusif</h1>
        </header>

        {/* Area Chat - Glassmorphism */}
        <div
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xl h-[400px] overflow-y-auto mb-6"
          role="log"
          aria-label="Riwayat Obrolan"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4 bg-blue-50/80 p-4 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-indigo-600 font-extrabold uppercase tracking-widest">{msg.sender}</p>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full uppercase font-bold border border-slate-200">
                  {msg.type === 'voice' ? '🎙️ Suara' : msg.type === 'sign' ? '🤟 Isyarat' : '📝 Teks'}
                </span>
              </div>
              <p className="text-slate-800 font-medium mb-3">{msg.text}</p>
              <button
                className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                aria-label={msg.type === 'voice' ? 'Terjemahkan pesan suara ke isyarat' : 'Terjemahkan pesan ke teks'}
              >
                {msg.type === 'voice' ? 'Terjemahkan ke Isyarat' : 'Terjemahkan ke Teks/Suara'}
              </button>
            </div>
          ))}
          {isListening && <p className="text-rose-600 animate-pulse font-bold text-center">🎙️ Mendengarkan suara...</p>}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl flex flex-col gap-4">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ketik pesan..."
            aria-label="Tulis pesan teks"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleSendMessage(inputText, "text")}
              className="bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} /> Kirim Teks
            </button>
            <button
              onClick={handleKirimSuara}
              className="bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
            >
              <Mic size={18} /> Kirim Suara
            </button>
            <Link
              href="/tunarungu"
              className="bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <Languages size={18} /> Kirim Isyarat
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}