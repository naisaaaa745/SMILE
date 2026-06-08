'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, RefreshCw, Loader2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface QuizOption {
  key: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

interface SubmitDetail {
  correct: boolean;
  correct_answer: string;
  user_answer: string;
}

interface QuizResult {
  status: string;
  score: number;
  correct_count: number;
  total_questions: number;
  details: { [key: string]: SubmitDetail };
  feedback: string;
}

export default function QuizGamePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Fetch quiz questions on mount
  const fetchQuestions = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setResult(null);
    setCurrentIdx(0);
    setAnswers({});
    try {
      const res = await fetch('http://localhost:5000/api/quiz');
      if (!res.ok) {
        throw new Error('Gagal mengambil daftar soal kuis dari server.');
      }
      const data = await res.json();
      setQuestions(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirimkan kuis.');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <Link href="/tunanetra" className="flex items-center gap-2 text-blue-700 font-bold hover:text-blue-800 transition-colors">
            <ArrowLeft size={20}/> Kembali ke Dashboard
          </Link>
          <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Quiz Game
          </span>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 shadow-md">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Memuat soal kuis...</p>
          </div>
        )}

        {/* Error state */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center shadow-md">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-950 mb-2">Terjadi Gangguan</h3>
            <p className="text-red-700 mb-6">{errorMsg}</p>
            <button 
              onClick={fetchQuestions}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Quiz is running */}
        {!isLoading && !errorMsg && questions.length > 0 && !result && (
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-2">
                <span>Soal {currentIdx + 1} dari {questions.length}</span>
                <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}% Selesai</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="min-h-[120px] mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
                {questions[currentIdx].question}
              </h2>
            </div>

            {/* Options list */}
            <div className="flex flex-col gap-4 mb-8">
              {questions[currentIdx].options.map((option) => {
                const isSelected = answers[questions[currentIdx].id] === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleSelectOption(questions[currentIdx].id, option.key)}
                    className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {option.key}
                    </span>
                    <span className="text-lg">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center border-t pt-6 border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors"
              >
                Sebelumnya
              </button>

              {currentIdx === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-green-600 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Jawaban kuis</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Selanjutnya
                </button>
              )}
            </div>
            
            {/* Warning if not all answered */}
            {!allAnswered && currentIdx === questions.length - 1 && (
              <p className="text-xs text-amber-600 font-bold text-center mt-4">
                * Harap jawab semua pertanyaan kuis untuk mengirimkan hasil.
              </p>
            )}

          </div>
        )}

        {/* Quiz Result Report Page */}
        {result && (
          <div className="space-y-6">
            
            {/* Main Score Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500"></div>
              
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
              
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Hasil Kuis Anda</h1>
              <p className="text-slate-500 font-medium mb-6">Skor Akhir Pembelajaran</p>

              {/* Large Score Circle */}
              <div className="w-36 h-36 rounded-full bg-blue-50 border-4 border-blue-200 flex flex-col items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-5xl font-black text-blue-700">{result.score}</span>
                <span className="text-xs font-bold text-slate-400 mt-1">
                  {result.correct_count} / {result.total_questions} Benar
                </span>
              </div>

              {/* Feedback Message */}
              <div className={`p-5 rounded-2xl text-left border ${
                result.score === 100 
                  ? 'bg-green-50 border-green-200 text-green-900' 
                  : result.score >= 50 
                    ? 'bg-blue-50 border-blue-200 text-blue-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2">
                  <span>🎯</span> Evaluasi Belajar
                </h3>
                <p className="font-semibold text-base leading-relaxed">{result.feedback}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button 
                  onClick={fetchQuestions}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  <span>Ulangi Kuis</span>
                </button>
                <Link href="/tunanetra">
                  <span className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-8 py-3 rounded-xl transition-all inline-block text-center cursor-pointer shadow-sm">
                    Kembali ke Dashboard
                  </span>
                </Link>
              </div>
            </div>

            {/* Question Review Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" />
                <span>Tinjauan Jawaban</span>
              </h2>

              {questions.map((q, idx) => {
                const questionDetail = result.details[q.id];
                const isCorrect = questionDetail?.correct;
                
                return (
                  <div key={q.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 relative">
                    <span className="absolute top-4 right-4 flex items-center gap-1.5 font-bold text-sm">
                      {isCorrect ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={16} /> Benar
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <XCircle size={16} /> Salah
                        </span>
                      )}
                    </span>

                    <h3 className="font-extrabold text-slate-800 text-lg mb-3 pr-16 leading-relaxed">
                      {idx + 1}. {q.question}
                    </h3>

                    {/* Show correct answer detail */}
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-slate-600">
                        Jawaban Anda: <span className={`font-extrabold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {questionDetail?.user_answer || "Tidak dijawab"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="font-semibold text-slate-700">
                          Kunci Jawaban: <span className="font-extrabold text-green-600">
                            {questionDetail?.correct_answer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        )}

      </div>
    </main>
  );
}
