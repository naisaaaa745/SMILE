'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, MessageSquareText, Gamepad2, Volume2, VolumeX } from 'lucide-react';

export default function DashboardTunanetra() {
  const [isAudioActive, setIsAudioActive] = useState(true);

  // Fungsi Suara (Core Feature)
  const speak = (text: string) => {
    if (isAudioActive && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Navigasi dengan feedback suara
  const handleNavigation = (title: string, link: string) => {
    speak(`Membuka menu ${title}. Mohon tunggu.`);
    setTimeout(() => {
      window.location.href = link;
    }, 1500);
  };

  useEffect(() => {
    speak("Selamat datang di SMILE. Gunakan tombol Tab untuk navigasi. Ada tiga menu: Materi, Ruang Diskusi, dan Kuis.");
  }, []);

  const features = [
    { title: "Materi Pembelajaran", desc: "Panduan audio mitigasi.", icon: BookOpen, link: "/lesson" },
    { title: "Ruang Diskusi", desc: "Kolaborasi inklusif.", icon: MessageSquareText, link: "/talk-space" },
    { title: "Kuis Interaktif", desc: "Uji pemahamanmu.", icon: Gamepad2, link: "/quis-game" }
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      {/* 1. Skip to Content (Aksesibilitas Standar) */}
      <a href="#menu" className="sr-only focus:not-sr-only focus:absolute focus:p-4 bg-blue-600 text-white font-bold z-50">
        Langsung ke Menu Utama
      </a>

      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard SMILE</h1>

        <button
          aria-label={isAudioActive ? "Matikan suara" : "Aktifkan suara"}
          onClick={() => {
            const newState = !isAudioActive;
            setIsAudioActive(newState);
            speak(newState ? "Mode suara diaktifkan" : "Mode suara dinonaktifkan");
          }}
          className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all ${isAudioActive ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}
        >
          {isAudioActive ? <Volume2 size={24} /> : <VolumeX size={24} />}
          {isAudioActive ? "Audio Aktif" : "Audio Mati"}
        </button>
      </nav>

      {/* 2. Menu Utama dengan Fokus Navigasi */}
      <div id="menu" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            tabIndex={0} // Membuat elemen bisa difokuskan dengan tombol Tab
            role="button"
            aria-label={`${item.title}. ${item.desc}`}
            onFocus={() => speak(`${item.title}. ${item.desc}`)}
            onMouseEnter={() => speak(`${item.title}. ${item.desc}`)}
            onClick={() => handleNavigation(item.title, item.link)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigation(item.title, item.link)}
            className="bg-white p-8 rounded-3xl border-4 border-blue-100 hover:border-blue-500 shadow-xl transition-all cursor-pointer flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <item.icon size={48} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="sr-only">Gunakan tombol panah atau tab untuk berpindah menu dan tekan enter untuk memilih.</p>
    </main>
  );
}