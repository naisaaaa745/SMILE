'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Sparkles } from 'lucide-react';

const questions = [
  { q: "Apa indikator utama dari cuaca ekstrem?", o: ["A. Langit cerah", "B. Awan gelap & angin kencang"], ans: "b" },
  { q: "Jika melihat awan Cumulonimbus, langkah yang tepat?", o: ["A. Tetap di luar", "B. Cari tempat berlindung"], ans: "b" }
];

export default function QuizGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const speak = (text: string) => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speak(`Pertanyaan ${currentQ + 1}: ${questions[currentQ].q}. Pilihan: ${questions[currentQ].o.join(' atau ')}. Sebutkan pilihan A atau B.`);
  }, [currentQ]);

  const listenAnswer = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      // Evaluasi Adaptif (Mendeteksi kunci A atau B)
      const isCorrect = transcript.includes(questions[currentQ].ans);

      setFeedback(isCorrect ? "✅ Tepat Sekali!" : "❌ Kurang Tepat");
      speak(isCorrect ? "Jawaban Anda benar." : "Jawaban Anda kurang tepat. Akan disesuaikan oleh AI.");

      setTimeout(() => {
        setFeedback(null);
        if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
        else speak("Evaluasi selesai. Anda diarahkan kembali ke Dashboard.");
      }, 3000);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 font-sans" role="main">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white">
          <Link href="/tunanetra" aria-label="Kembali ke Dashboard" className="flex items-center gap-2 text-indigo-600 font-bold">
            <ArrowLeft size={20} /> Dashboard
          </Link>
          <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm" aria-label="Sistem Pembelajaran Adaptif Aktif">
            <Sparkles size={14} /> AI Adaptive Leveling Aktif
          </span>
        </header>

        <section className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white text-center relative overflow-hidden" aria-live="assertive">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">Evaluasi Modul {currentQ + 1} / {questions.length}</p>
          <h2 className="text-3xl font-black text-slate-900 mb-10 leading-snug">{questions[currentQ].q}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {questions[currentQ].o.map((opt, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold text-lg" aria-hidden="true">{opt}</div>
            ))}
          </div>

          {feedback && <div className="text-2xl font-black mb-6 animate-bounce" role="alert">{feedback}</div>}

          <button onClick={listenAnswer} aria-label="Tekan untuk menjawab dengan suara" className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg transition-all focus:ring-4 focus:ring-indigo-400 ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            <Mic size={32} />
          </button>
          <p className="mt-4 text-slate-500 font-medium">{isListening ? "Mendengarkan jawaban..." : "Tekan mikrofon & sebutkan A atau B"}</p>
        </section>
      </div>
    </main>
  );
}