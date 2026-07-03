'use client';
import { useState } from 'react';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import Link from 'next/link';

export default function TalkSpace() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Naila (Tunanetra)", text: "Halo teman-teman, apakah materi hari ini jelas?" },
    { id: 2, sender: "Budi (Tunarungu)", text: "Halo Naila! Ya, videonya sangat membantu." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = async (textToSend: string = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), sender: "Anda", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    try {
      const res = await fetch('http://localhost:5000/api/talkspace/stt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        const botMsg = { id: Date.now() + 1, sender: "Asisten SMILE", text: data.reply };
        setMessages(prev => [...prev, botMsg]);
        const ttsRes = await fetch('http://localhost:5000/api/talkspace/tts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.reply })
        });
        const ttsData = await ttsRes.json();
        if (ttsRes.ok && ttsData.audio_url) {
          const audio = new Audio(ttsData.audio_url);
          audio.play().catch(e => console.error(e));
        }
      }
    } catch (err) { console.error(err); }
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Maaf, browser kamu tidak mendukung fitur rekaman suara."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript); handleSendMessage(transcript);
    };
    recognition.start();
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900 p-6 md:p-12 flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-10">
        <header className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm">
          <Link href="/tunanetra" className="flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600">
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </Link>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-sm">Talk Space AI Multimodal</span>
        </header>

        <div className="flex-1 bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-xl mb-6 overflow-y-auto max-h-[500px] space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-4 rounded-2xl border shadow-sm ${msg.sender === "Anda" ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-12 border-transparent' : 'bg-white border-slate-200/80 mr-12 text-slate-800'}`}>
              <p className={`text-xs font-black mb-1 ${msg.sender === "Anda" ? 'text-blue-200' : 'text-indigo-600'}`}>{msg.sender}</p>
              <p className="font-medium text-base">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-2xl border-2 border-white focus:border-indigo-600 outline-none font-medium shadow-md" placeholder="Ketik pesan atau tekan rekam suara..." />
          <button onClick={startRecording} className={`px-6 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-md text-white ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105'}`}>
            <Mic size={20} /> <span className="hidden md:inline">{isRecording ? "Mendengarkan..." : "Rekam"}</span>
          </button>
          <button onClick={() => handleSendMessage()} className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 rounded-2xl font-bold text-white hover:scale-105 transition-all flex items-center justify-center shadow-md">
            <Send size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}