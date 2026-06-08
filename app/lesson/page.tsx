'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Type, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LessonData {
  id: number;
  title: string;
  teks_materi: string;
  audio_url: string;
}

export default function LessonPage() {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Accessibility State
  const [isLargeText, setIsLargeText] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch lesson data
  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch('http://localhost:5000/api/lesson');
        if (!res.ok) {
          throw new Error('Gagal memuat materi pelajaran dari server.');
        }
        const data = await res.json();
        setLesson(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan koneksi backend.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchLesson();
  }, []);

  // Sync audio progress
  useEffect(() => {
    if (!lesson) return;
    
    const audio = new Audio(lesson.audio_url);
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [lesson]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <Link href="/tunanetra" className="flex items-center gap-2 text-blue-700 font-bold hover:text-blue-800 transition-colors">
            <ArrowLeft size={20}/> Kembali ke Dashboard
          </Link>
          
          {/* Accessibility Controls */}
          <div className="flex gap-3">
            <button 
              onClick={() => setIsLargeText(!isLargeText)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all border ${
                isLargeText ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Type size={18} />
              <span>{isLargeText ? 'Teks Sedang' : 'Teks Besar'}</span>
            </button>
          </div>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 shadow-md">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Memuat materi pelajaran...</p>
          </div>
        )}

        {/* Error state */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center shadow-md">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-950 mb-2">Gagal Memuat Materi</h3>
            <p className="text-red-700 mb-6">{errorMsg}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl transition-all"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Content loaded successfully */}
        {lesson && (
          <article className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full opacity-60"></div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 border-b pb-4 border-slate-100 pr-10">
              {lesson.title}
            </h1>

            {/* Custom Audio Narration Panel */}
            <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Volume2 size={24} className={isPlaying ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Audio Panduan Pembelajaran</h3>
                  <p className="text-xs text-slate-500">Gunakan audio ini untuk penjelasan materi yang lebih interaktif</p>
                </div>
              </div>
              
              {/* Media Controls */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {/* Audio Progress Bar */}
                <div className="text-xs font-mono text-slate-500 mr-2">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
                
                <button 
                  onClick={togglePlay}
                  className="w-14 h-14 bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-md transition-all font-bold"
                  title={isPlaying ? "Jeda" : "Putar"}
                >
                  {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} className="ml-1" fill="white" />}
                </button>
                
                <button 
                  onClick={restartAudio}
                  className="w-12 h-12 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full flex items-center justify-center shadow-sm transition-all"
                  title="Putar Ulang"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* Lesson Materials Text */}
            <div className={`leading-relaxed text-slate-800 transition-all font-medium ${
              isLargeText ? 'text-2xl space-y-6' : 'text-lg space-y-4'
            }`}>
              <p>{lesson.teks_materi}</p>
            </div>

            {/* Hint Box */}
            <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-amber-950 mb-1">Tips Belajar Mandiri</h4>
                <p className="text-sm text-amber-800">
                  Dengarkan audio sambil membaca teks di atas secara perlahan. Setelah selesai membaca, Anda bisa mencoba **Quis Game** di dashboard untuk menguji ingatan Anda!
                </p>
              </div>
            </div>
            
          </article>
        )}
      </div>
    </main>
  );
}
