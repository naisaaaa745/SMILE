'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Type, ChevronLeft, ChevronRight, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

const lessonData = [
  { id: 1, text: "Perubahan iklim adalah pergeseran jangka panjang dalam suhu dan pola cuaca bumi.", videoId: "qxcjni_nXTc" },
  { id: 2, text: "Akibat perubahan iklim, terjadi cuaca ekstrem seperti hujan lebat yang memicu banjir.", videoId: "qxcjni_nXTc" },
  { id: 3, text: "Selain banjir, perubahan iklim menyebabkan kekeringan panjang yang sulitkan akses air.", videoId: "qxcjni_nXTc" },
  { id: 4, text: "Mari kita lindungi bumi dengan menanam pohon dan mengurangi sampah plastik.", videoId: "qxcjni_nXTc" }
];

export default function LessonPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showLKPDSelection, setShowLKPDSelection] = useState(false);
  const [activeLKPD, setActiveLKPD] = useState<'tunarungu' | 'tunanetra' | null>(null);

  const speak = (text: string) => {
    if (!isAudioEnabled || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!showLKPDSelection && !activeLKPD && isAudioEnabled) speak(lessonData[currentStep].text);
  }, [currentStep, isAudioEnabled, showLKPDSelection, activeLKPD]);

  const LKPDContent = {
    tunarungu: {
      title: "LKPD Tunarungu: Hujan Lebat",
      questions: [
        { q: "Bagaimana keadaan langit sebelum hujan?", opt: ["Cerah", "Gelap"] },
        { q: "Apa yang terjadi saat hujan lebat?", opt: ["Jalan tergenang air", "Jalan kering"] },
        { q: "Apa yang harus dilakukan saat hujan lebat?", opt: ["Menggunakan payung", "Bermain di genangan"] }
      ]
    },
    tunanetra: {
      title: "LKPD Tunanetra: Hujan Lebat",
      questions: [
        { q: "Sebelum hujan turun, langit tampak?", opt: ["Cerah", "Gelap"] },
        { q: "Hujan turun deras hingga air menggenang disebut?", opt: ["Cuaca cerah", "Hujan lebat"] },
        { q: "Saat hujan lebat sebaiknya?", opt: ["Gunakan payung", "Bermain hujan"] }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 text-slate-900 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/60 shadow-sm">
          <Link href="/tunanetra" className="flex items-center gap-2 text-indigo-700 font-bold hover:text-indigo-900"><ArrowLeft size={20} /> Kembali</Link>
          <div className="flex gap-3">
            {/* Tombol Audio yang Hilang Sudah Dikembalikan */}
            <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm border ${isAudioEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} {isAudioEnabled ? 'Audio Aktif' : 'Audio Mati'}
            </button>
            <button onClick={() => setIsLargeText(!isLargeText)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white shadow-sm border"><Type size={18} /> Teks</button>
          </div>
        </header>

        {!showLKPDSelection && !activeLKPD ? (
          <article className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50">
            <h1 className="text-3xl font-black mb-6">Materi: Cuaca & Iklim</h1>
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8 border-4 border-white">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${lessonData[currentStep].videoId}?autoplay=1`} allowFullScreen></iframe>
            </div>
            <div className={`p-8 rounded-2xl bg-white/60 text-center font-bold ${isLargeText ? 'text-3xl' : 'text-xl'}`}>"{lessonData[currentStep].text}"</div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} disabled={currentStep === 0} className="px-6 py-3 rounded-2xl bg-white border"><ChevronLeft /></button>
              {currentStep < lessonData.length - 1 ? (
                <button onClick={() => setCurrentStep(prev => prev + 1)} className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold">Lanjut</button>
              ) : (
                <button onClick={() => setShowLKPDSelection(true)} className="px-8 py-3 rounded-2xl bg-emerald-600 text-white font-bold flex items-center gap-2"><FileText size={20} /> Selesai, Buka LKPD</button>
              )}
            </div>
          </article>
        ) : showLKPDSelection ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-xl">
            <h2 className="text-2xl font-black mb-6">Pilih Mode LKPD</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setShowLKPDSelection(false); setActiveLKPD('tunarungu'); }} className="p-8 bg-purple-100 rounded-2xl font-bold">Tunarungu</button>
              <button onClick={() => { setShowLKPDSelection(false); setActiveLKPD('tunanetra'); }} className="p-8 bg-blue-100 rounded-2xl font-bold">Tunanetra</button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-black mb-6">{LKPDContent[activeLKPD!].title}</h2>
            {LKPDContent[activeLKPD!].questions.map((item, i) => (
              <div key={i} className="mb-6 p-6 bg-slate-50 rounded-2xl">
                <p className="font-bold mb-3">{i + 1}. {item.q}</p>
                <div className="flex gap-4">
                  {item.opt.map((o, j) => (
                    <button key={j} onClick={() => speak(`Anda memilih ${o}`)} className="px-4 py-2 bg-white border rounded-xl font-bold hover:bg-indigo-50">{o}</button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => setActiveLKPD(null)} className="text-indigo-600 font-bold">← Kembali ke Materi</button>
          </div>
        )}
      </div>
    </main>
  );
}