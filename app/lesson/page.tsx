'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Type, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Materi 10 Langkah dari Temanmu
const lessonData = [
  { id: 1, text: "Halo, selamat datang di SMILE. Hari ini kita akan belajar tentang Cuaca Ekstrem Akibat Perubahan Iklim." },
  { id: 2, text: "Cuaca ekstrem adalah kondisi cuaca yang terjadi dengan intensitas tinggi, seperti hujan lebat, angin kencang, kekeringan, maupun gelombang panas." },
  { id: 3, text: "Hujan yang turun sangat deras dalam waktu lama dapat menyebabkan banjir yang merendam rumah dan jalan." },
  { id: 4, text: "Kekeringan terjadi karena hujan tidak turun dalam waktu lama, sehingga tanaman sulit tumbuh dan air bersih sulit didapat." },
  { id: 5, text: "Angin kencang dapat menyebabkan pohon tumbang dan merusak bangunan. Saat terjadi, kita harus berlindung di tempat aman." },
  { id: 6, text: "Gelombang panas adalah kondisi suhu udara sangat tinggi selama beberapa hari yang dapat menyebabkan tubuh cepat lelah." },
  { id: 7, text: "Cuaca ekstrem berdampak buruk bagi lingkungan, kesehatan, aktivitas masyarakat, dan hasil pertanian." },
  { id: 8, text: "Cara menghadapinya adalah dengan memperhatikan informasi cuaca, menjaga kesehatan, dan mengikuti arahan petugas." },
  { id: 9, text: "Kita bisa mengurangi dampaknya dengan menanam pohon, menghemat listrik, menghemat air, dan menjaga kebersihan." },
  { id: 10, text: "Hebat! Kamu sudah memahami materi ini. Mari terus menjaga bumi kita. Sampai jumpa di pembelajaran berikutnya!" }
];

export default function LessonPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fungsi Audio (Web Speech API) yang diselaraskan dengan animasi UI
  const playAudio = (text: string) => {
    if (typeof window === 'undefined') return;

    window.speechSynthesis.cancel(); // Hentikan suara sebelumnya
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Sedikit dipelankan agar lebih jelas bagi siswa

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Putar suara otomatis setiap kali langkah (step) berubah
  useEffect(() => {
    playAudio(lessonData[currentStep].text);

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep]);

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900 p-6 md:p-12">
      {/* Background Estetik milikmu */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      <div className="absolute top-[-5%] left-[20%] w-[500px] h-[350px] bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm">
          <Link href="/tunanetra" className="flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </Link>
          <button
            onClick={() => setIsLargeText(!isLargeText)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all border ${isLargeText ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <Type size={18} />
            <span>{isLargeText ? 'Teks Sedang' : 'Teks Besar'}</span>
          </button>
        </header>

        <article className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white shadow-xl relative overflow-hidden">
          {/* Badge Adegan & Judul */}
          <div className="flex items-center justify-between border-b pb-6 border-slate-200 mb-8 flex-wrap gap-4">
            <div>
              <span className="bg-blue-100 text-blue-700 font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Materi Interaktif • Adegan {lessonData[currentStep].id} dari {lessonData.length}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                Cuaca Ekstrem Akibat Perubahan Iklim
              </h1>
            </div>
          </div>

          {/* Banner Audio Panduan */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-6 rounded-2xl mb-8 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Volume2 size={24} className={isPlaying ? 'animate-bounce' : ''} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">Audio Narasi Otomatis</h3>
                <p className="text-xs text-slate-500 font-medium">Suara akan membacakan teks setiap adegan diganti</p>
              </div>
            </div>

            <button
              onClick={() => playAudio(lessonData[currentStep].text)}
              className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all flex-shrink-0"
              title="Putar Ulang Suara"
            >
              <RotateCcw size={16} /> <span className="hidden sm:inline">Ulangi Audio</span>
            </button>
          </div>

          {/* Kotak Materi Teks Utama */}
          <div className={`min-h-[160px] flex items-center justify-center p-8 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all text-center font-bold text-slate-800 ${isLargeText ? 'text-2xl md:text-3xl leading-relaxed' : 'text-xl md:text-2xl leading-normal'
            }`}>
            <p>"{lessonData[currentStep].text}"</p>
          </div>

          {/* Tombol Navigasi Step-by-Step */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition-all"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>

            <div className="text-sm font-bold text-slate-400 font-mono hidden sm:block">
              {currentStep + 1} / {lessonData.length}
            </div>

            {currentStep < lessonData.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, lessonData.length - 1))}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105"
              >
                Lanjut <ChevronRight size={20} />
              </button>
            ) : (
              <Link
                href="/tunanetra"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <CheckCircle2 size={20} /> Selesai Belajar
              </Link>
            )}
          </div>

          {/* Tips Belajar */}
          <div className="mt-12 bg-amber-50/80 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-extrabold text-amber-950 mb-1">Tips Belajar Interaktif</h4>
              <p className="text-sm text-amber-800 font-medium">
                Gunakan tombol <b>Lanjut</b> dan <b>Sebelumnya</b> untuk menavigasi materi secara bertahap. Kamu bisa menekan tombol <b>Ulangi Audio</b> jika ingin mendengarkan ulang adegan saat ini.
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}