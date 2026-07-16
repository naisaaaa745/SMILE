'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, MessageSquareText, Gamepad2, Volume2, VolumeX, Mic, ArrowRight } from 'lucide-react';

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
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); startVoiceCommand(); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const features = [
    {
      title: "Lesson",
      desc: "Materi pembelajaran interaktif dengan integrasi teks dan panduan audio pemandu.",
      icon: BookOpen,
      link: "/lesson",
      gradientBg: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100/80 text-blue-700 border border-blue-200"
    },
    {
      title: "Ruang Diskusi",
      desc: "Ruang komunikasi dua arah inklusif dengan teknologi AI Multimodal.",
      icon: MessageSquareText,
      link: "/talk-space",
      gradientBg: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-100/80 text-purple-700 border border-purple-200"
    },
    {
      title: "Quis Game",
      desc: "Evaluasi pembelajaran berbasis gamifikasi interaktif yang menyenangkan.",
      icon: Gamepad2,
      link: "/quis-game",
      gradientBg: "from-orange-500 to-amber-400",
      iconBg: "bg-orange-100/80 text-orange-700 border border-orange-200"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - Tombol Suara & Navigasi Suara di atas */}
        <div className="bg-white/70 backdrop-blur-md px-8 py-8 rounded-3xl shadow-xl shadow-indigo-950/5 border border-white/60 mb-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-black text-slate-900">Dashboard Tunanetra</h1>

            <div className="flex items-center gap-3">
              <button onClick={startVoiceCommand} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600 hover:scale-105'}`}>
                <Mic size={20} /> <span>{isListening ? "Mendengarkan..." : "Perintah Suara"}</span>
              </button>
              <button onClick={() => setIsAudioActive(!isAudioActive)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                {isAudioActive ? <Volume2 size={20} className="text-indigo-600" /> : <VolumeX size={20} />}
                <span>{isAudioActive ? "Audio Aktif" : "Audio Mati"}</span>
              </button>
            </div>
          </div>

          {/* Area Gambar dengan fokus wajah */}
          <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-lg relative bg-white/50 border border-white/50">
            <Image
              src="/dashboard-tunanetra.png"
              alt="Ilustrasi Tunanetra"
              fill
              className="object-cover object-[50%_20%]"
            />
          </div>
        </div>

        {/* Grid Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div key={index} onClick={() => router.push(item.link)} className="group relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/80 p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradientBg} rounded-t-3xl`}></div>
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${item.iconBg}`}>
                  <item.icon size={30} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">{item.desc}</p>
              </div>
              <div className="inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                Mulai Sekarang <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}