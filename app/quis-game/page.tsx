'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle2, XCircle, Award, HelpCircle } from 'lucide-react';
import Link from 'next/link';

// Data Kuis yang disusun dari Materi Cuaca Ekstrem
const quizQuestions = [
  {
    id: 1,
    question: "Kondisi cuaca yang terjadi dengan intensitas sangat tinggi dan membahayakan lingkungan disebut...",
    options: ["Cuaca Cerah", "Cuaca Ekstrem", "Musim Pancaroba", "Pola Iklim"],
    correctAnswer: 1,
    explanation: "Cuaca ekstrem adalah kondisi cuaca yang tidak normal dengan intensitas tinggi, seperti hujan lebat atau gelombang panas."
  },
  {
    id: 2,
    question: "Salah satu penyebab utama meningkatnya kejadian cuaca ekstrem di berbagai wilayah adalah...",
    options: ["Perubahan Iklim", "Rotasi Bumi", "Banyaknya Pepohonan", "Gerhana Matahari"],
    correctAnswer: 0,
    explanation: "Perubahan iklim menyebabkan pergeseran pola cuaca sehingga cuaca ekstrem lebih sering terjadi."
  },
  {
    id: 3,
    question: "Apa tindakan yang tepat saat terjadi banjir di lingkungan sekitar kita?",
    options: ["Bermain di genangan air banjir", "Mengikuti arahan petugas dan mencari tempat aman", "Tetap tidur di dalam rumah yang terendam", "Membuang sampah ke sungai"],
    correctAnswer: 1,
    explanation: "Mengikuti arahan evakuasi petugas sangat penting untuk menjaga keselamatan diri dari bahaya banjir."
  },
  {
    id: 4,
    question: "Kekeringan yang berkepanjangan dapat mengakibatkan dampak buruk, yaitu...",
    options: ["Tanaman tumbuh subur", "Sulit memperoleh air bersih", "Sungai meluap deras", "Suhu udara menjadi sangat dingin"],
    correctAnswer: 1,
    explanation: "Saat kekeringan, cadangan air menurun drastis sehingga air bersih sulit didapat dan tanaman layu."
  },
  {
    id: 5,
    question: "Tindakan sederhana yang bisa kita lakukan untuk membantu mengurangi dampak perubahan iklim adalah...",
    options: ["Menggunakan plastik sekali pakai sebanyak mungkin", "Menanam pohon dan menghemat listrik", "Menebang pohon di pekarangan", "Membiarkan lampu menyala seharian"],
    correctAnswer: 1,
    explanation: "Menanam pohon dan menghemat energi (listrik/air) adalah langkah nyata mengurangi pemanasan global."
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fitur Audio untuk membacakan pertanyaan & opsi (Ramah Tunanetra)
  const readQuestion = (index: number) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    const q = quizQuestions[index];
    const textToSpeak = `Pertanyaan nomor ${q.id}. ${q.question}. Pilihan jawaban: A. ${q.options[0]}. B. ${q.options[1]}. C. ${q.options[2]}. D. ${q.options[3]}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Baca otomatis saat soal berganti
  useEffect(() => {
    if (!showResult) {
      readQuestion(currentQuestion);
    }
    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
  }, [currentQuestion, showResult]);

  // Handle pilih jawaban
  const handleSelectOption = (index: number) => {
    if (isSubmitted) return; // Kunci jawaban jika sudah disubmit
    setSelectedOption(index);
  };

  // Cek Jawaban
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  // Lanjut ke soal berikutnya
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  // Ulangi Kuis
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900 p-6 md:p-12 flex flex-col justify-center">
      {/* Background Estetik */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      <div className="absolute top-[15%] right-[10%] w-[450px] h-[450px] bg-gradient-to-tr from-blue-400/25 to-indigo-400/25 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl w-full mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm">
          <Link href="/tunanetra" className="flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </Link>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5">
            <HelpCircle size={14} /> Kuis Interaktif SMILE
          </span>
        </header>

        {!showResult ? (
          <article className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white shadow-xl">
            {/* Header Soal & Audio */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6 flex-wrap gap-4">
              <div>
                <span className="bg-blue-100 text-blue-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                </span>
              </div>
              <button
                onClick={() => readQuestion(currentQuestion)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                title="Bacakan Soal"
              >
                <Volume2 size={16} className={isPlayingAudio ? 'animate-bounce' : ''} />
                <span>Bacakan Soal</span>
              </button>
            </div>

            {/* Teks Pertanyaan */}
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 leading-snug">
              {quizQuestions[currentQuestion].question}
            </h2>

            {/* Opsi Pilihan Ganda */}
            <div className="space-y-3.5 mb-8">
              {quizQuestions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;

                let optionStyle = "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/30";

                if (isSelected) {
                  optionStyle = "bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-md";
                }

                // Styling warna setelah jawaban disubmit
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold";
                  } else {
                    optionStyle = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all flex items-center justify-between gap-4 font-medium ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-base md:text-lg">{option}</span>
                    </div>

                    {isSubmitted && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Penjelasan Pembahasan Materi (Muncul setelah submit) */}
            {isSubmitted && (
              <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-2xl mb-8 flex items-start gap-3.5 animate-fadeIn">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <h4 className="font-extrabold text-blue-950 text-sm mb-1">Pembahasan Singkat:</h4>
                  <p className="text-sm font-medium text-blue-900 leading-relaxed">
                    {quizQuestions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Tombol Action */}
            <div className="flex justify-end pt-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  Kunci Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Akhir →'}
                </button>
              )}
            </div>
          </article>
        ) : (
          /* Tampilan Hasil Akhir Kuis */
          <div className="bg-white/90 backdrop-blur-md p-10 md:p-12 rounded-3xl border border-white shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-6">
              <Award size={40} />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2">Kuis Selesai!</h2>
            <p className="text-slate-600 font-medium mb-8">
              Kamu telah menyelesaikan latihan soal mengenai <span className="font-bold text-slate-800">Cuaca Ekstrem</span>.
            </p>

            {/* Kotak Nilai */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 max-w-sm mx-auto p-6 rounded-3xl mb-8 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Skor Jawaban Benar</p>
              <div className="text-5xl font-black text-slate-900">
                {score} <span className="text-2xl font-bold text-slate-400">/ {quizQuestions.length}</span>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-3">
                {score === quizQuestions.length ? '🌟 Luar Biasa! Pemahamanmu sangat sempurna.' : score >= 3 ? '👍 Bagus! Kamu sudah memahami materi dengan baik.' : '💪 Tetap semangat! Jangan ragu untuk membaca ulang materi.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-3.5 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <RotateCcw size={18} /> Ulangi Kuis
              </button>
              <Link
                href="/tunanetra"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-md shadow-blue-500/25 transition-all"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}