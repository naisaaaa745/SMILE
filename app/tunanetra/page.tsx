'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

  // Navigasi Perintah Suara (Speech-to-Text)
  const startVoiceCommand = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak("Browser tidak mendukung navigasi suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => {
      setIsListening(true);
      speak("Silakan sebutkan perintah. Contoh: Buka Kuis, Buka Materi, atau Buka Diskusi.");
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes("materi") || command.includes("lesson")) {
        speak("Membuka Modul Materi. Mohon tunggu.");
        setTimeout(() => router.push('/lesson'), 1500);
      } else if (command.includes("kuis") || command.includes("game")) {
        speak("Membuka Evaluasi Kuis. Mohon tunggu.");
        setTimeout(() => router.push('/quis-game'), 1500);
      } else if (command.includes("diskusi") || command.includes("talk space")) {
        speak("Membuka Ruang Diskusi. Mohon tunggu.");
        setTimeout(() => router.push('/talk-space'), 1500);
      } else {
        speak(`Perintah ${command} tidak dikenali. Silakan coba lagi.`);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    speak("Anda berada di Dashboard Utama. Tekan tombol spasi untuk mengaktifkan navigasi suara, atau gunakan tombol tab.");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); startVoiceCommand(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.speechSynthesis.cancel(); };
  }, []);

  const features = [
    { title: "Modul Materi", desc: "Panduan mitigasi bencana interaktif.", icon: BookOpen, link: "/lesson" },
    { title: "Ruang Diskusi", desc: "Forum kolaborasi inklusif.", icon: MessageSquareText, link: "/talk-space" },
    { title: "Evaluasi Kuis", desc: "Uji pemahaman adaptif.", icon: Gamepad2, link: "/quis-game" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 font-sans text-slate-900" role="main">
      <a href="#menu" className="sr-only focus:not-sr-only focus:absolute focus:p-4 bg-blue-600 text-white font-bold z-50 rounded-xl">Langsung ke Menu</a>

      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/80 backdrop-blur-md px-8 py-5 rounded-3xl shadow-sm border border-white/60">
          <h1 className="text-3xl font-black text-indigo-700" tabIndex={0} aria-label="Dashboard Pembelajaran Tunanetra">Dashboard Tunanetra</h1>
          <button aria-label={isAudioActive ? "Matikan suara sistem" : "Aktifkan suara sistem"} onClick={() => setIsAudioActive(!isAudioActive)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
            {isAudioActive ? <Volume2 size={20} className="text-indigo-600" /> : <VolumeX size={20} />}
            <span>{isAudioActive ? "Audio Aktif" : "Audio Mati"}</span>
          </button>
        </nav>

        {/* Panel Kontrol Suara (Voice-Driven) */}
        <section aria-label="Kontrol Navigasi Suara" className="bg-white/90 p-8 rounded-3xl border border-white shadow-xl mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4" tabIndex={0}>Navigasi Perintah Suara</h2>
          <button onClick={startVoiceCommand} aria-label="Tekan untuk memberikan perintah suara" className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-all focus:ring-4 focus:ring-indigo-400 ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105'}`}>
            <Mic size={32} />
          </button>
          <p className="font-medium text-slate-600" aria-live="polite">{isListening ? "Mendengarkan perintah..." : "Tekan mikrofon atau tombol Spasi, lalu sebutkan menu tujuan."}</p>
        </section>

        <div id="menu" className="grid grid-cols-1 md:grid-cols-3 gap-8" role="navigation" aria-label="Menu Utama">
          {features.map((item, index) => (
            <div key={index} tabIndex={0} role="link" aria-label={`Buka ${item.title}. ${item.desc}`} onFocus={() => speak(item.title)} onClick={() => router.push(item.link)} onKeyDown={(e) => e.key === 'Enter' && router.push(item.link)} className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border-2 border-transparent hover:border-indigo-400 shadow-xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-indigo-300">
              <div className="bg-indigo-50 p-6 rounded-2xl mb-6 shadow-inner text-indigo-600"><item.icon size={48} /></div>
              <h3 className="text-2xl font-black mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-600 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}