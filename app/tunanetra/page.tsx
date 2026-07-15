'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, MessageSquareText, Gamepad2, Volume2, VolumeX, Mic } from 'lucide-react';

export default function DashboardTunanetra() {
  const router = useRouter();
  const [isAudioActive, setIsAudioActive] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const speak = (text: string) => {
    if (isAudioActive && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceCommand = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { speak("Browser tidak mendukung navigasi suara."); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => { setIsListening(true); speak("Silakan sebutkan: Materi, Kuis, atau Diskusi."); };
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes("materi")) { speak("Membuka Modul Materi."); router.push('/lesson'); }
      else if (command.includes("kuis")) { speak("Membuka Evaluasi Kuis."); router.push('/quis-game'); }
      else if (command.includes("diskusi")) { speak("Membuka Ruang Diskusi."); router.push('/talk-space'); }
      else speak("Perintah tidak dikenali.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    speak("Dashboard Tunanetra. Gunakan tombol spasi untuk perintah suara.");
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); startVoiceCommand(); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const features = [
    { title: "Lesson", desc: "Panduan mitigasi bencana interaktif.", icon: BookOpen, link: "/lesson", topBorder: "border-t-4 border-t-blue-400" },
    { title: "Ruang Diskusi", desc: "Forum kolaborasi inklusif.", icon: MessageSquareText, link: "/talk-space", topBorder: "border-t-4 border-t-purple-400" },
    { title: "Quis Game", desc: "Uji pemahaman adaptif.", icon: Gamepad2, link: "/quis-game", topBorder: "border-t-4 border-t-orange-400" }
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Sama Persis dengan Tunarungu */}
        <nav className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-black text-indigo-700">Dashboard Tunanetra</h1>
          <button onClick={() => setIsAudioActive(!isAudioActive)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
            {isAudioActive ? <Volume2 size={20} className="text-indigo-600" /> : <VolumeX size={20} />}
            <span>{isAudioActive ? "Audio Aktif" : "Audio Mati"}</span>
          </button>
        </nav>

        {/* Panel Navigasi Suara */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Navigasi Perintah Suara</h2>
          <button onClick={startVoiceCommand} className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-600 text-white hover:scale-105'}`}>
            <Mic size={32} />
          </button>
          <p className="font-medium text-slate-600">Tekan mikrofon atau tombol Spasi, lalu sebutkan menu tujuan.</p>
        </section>

        {/* Grid Menu Kartu (Sama Persis Tunarungu) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div key={index} onClick={() => router.push(item.link)} className={`bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer ${item.topBorder}`}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-100 text-indigo-600">
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}