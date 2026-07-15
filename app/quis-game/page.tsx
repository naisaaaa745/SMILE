'use client';
import { useState, useEffect } from 'react';

const questions = [
  { q: "Apa indikator utama dari cuaca ekstrem?", o: ["Langit cerah", "Awan gelap & angin kencang"] },
  { q: "Jika melihat awan Cumulonimbus, langkah apa yang tepat?", o: ["Tetap di luar", "Segera cari tempat berlindung"] },
  { q: "Apa yang dilakukan saat petir menyambar di dekatmu?", o: ["Berlari di lapangan", "Matikan elektronik & menjauh dari jendela"] },
  { q: "Tindakan efektif meminimalisir banjir di sekolah?", o: ["Menutup saluran air", "Menjaga kebersihan selokan"] },
  { q: "Mengapa dilarang berlindung di bawah pohon saat angin kencang?", o: ["Pohon bisa tumbang", "Menghalangi pandangan"] },
  { q: "Tujuan utama sistem peringatan dini adalah?", o: ["Menakuti warga", "Memberi waktu evakuasi"] },
  { q: "Jika ada teman tunanetra saat bencana, apa tindakanmu?", o: ["Biarkan dia sendiri", "Beri info suara & tuntun ke tempat aman"] },
  { q: "Jika teman tunarungu memberi isyarat 'Petir', apa yang kamu lakukan?", o: ["Mengabaikan", "Cari perlindungan bersama"] },
  { q: "Mengapa kolaborasi antar-disabilitas penting?", o: ["Tidak penting", "Saling melengkapi kelebihan"] },
  { q: "Apa yang dimaksud dengan 'Mitigasi'?", o: ["Upaya memadamkan api", "Mengurangi risiko bencana sebelum terjadi"] }
];

export default function QuizGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak(`Soal ${currentQ + 1}: ${questions[currentQ].q}. Pilihan: ${questions[currentQ].o.join(', ')}`);
  }, [currentQ]);

  const listenAnswer = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      // Logika: jawaban benar adalah index 1 (berdasarkan struktur array)
      if (transcript.includes(questions[currentQ].o[1].toLowerCase())) {
        cekJawaban(1);
      } else {
        cekJawaban(0);
      }
    };
    recognition.start();
  };

  const cekJawaban = (idx: number) => {
    const isCorrect = idx === 1;
    setFeedback(isCorrect ? "✅ Benar" : "❌ Salah");
    speak(isCorrect ? "Jawaban anda benar" : "Jawaban anda salah, coba lagi");
    setTimeout(() => {
      setFeedback(null);
      if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
      else speak("Kuis selesai. Kerja bagus!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-indigo-400">Game Kuis Inklusif</h1>

      <div className={`p-8 rounded-3xl border-2 w-full max-w-lg transition-colors ${feedback ? (feedback.includes('Benar') ? 'bg-green-900 border-green-500' : 'bg-red-900 border-red-500') : 'bg-slate-900 border-indigo-800'}`}>
        <p className="text-indigo-300 mb-2">Soal {currentQ + 1} dari 10</p>
        <h2 className="text-2xl mb-6">{questions[currentQ].q}</h2>

        {feedback && <p className="text-4xl font-bold mb-6 text-center">{feedback}</p>}

        <button onClick={listenAnswer} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold flex justify-center items-center gap-2">
          <span>🔊</span> Klik & Sebutkan Jawaban
        </button>
      </div>
    </div>
  );
}