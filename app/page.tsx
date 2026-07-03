'use client';
import Link from 'next/link';
import { BookOpen, MessageSquareText, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Lesson",
      desc: "Materi pembelajaran interaktif dengan integrasi teks dan panduan audio pemandu.",
      gradientBg: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100/80 text-blue-700 border border-blue-200",
      accentColor: "group-hover:text-blue-600"
    },
    {
      icon: MessageSquareText,
      title: "Talk Space",
      desc: "Ruang komunikasi dua arah inklusif dengan teknologi AI Multimodal.",
      gradientBg: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-100/80 text-purple-700 border border-purple-200",
      accentColor: "group-hover:text-purple-600"
    },
    {
      icon: Gamepad2,
      title: "Quis Game",
      desc: "Evaluasi pembelajaran berbasis gamifikasi interaktif yang menyenangkan.",
      gradientBg: "from-orange-500 to-amber-400",
      iconBg: "bg-orange-100/80 text-orange-700 border border-orange-200",
      accentColor: "group-hover:text-orange-600"
    }
  ];

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900">

      {/* ================= BACKGROUND ESTETIK TERJAMIN NYATA ================= */}
      {/* 1. Pola Grid Modern Halus */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      {/* 2. Cahaya Gradasi (Glowing Orbs) yang Nyata */}
      <div className="absolute top-[-5%] left-[15%] w-[500px] h-[350px] bg-gradient-to-tr from-blue-400/40 to-indigo-400/40 blur-[80px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute top-[25%] right-[-5%] w-[550px] h-[550px] bg-gradient-to-bl from-purple-400/35 via-fuchsia-300/25 to-indigo-400/35 blur-[90px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-gradient-to-tr from-teal-300/40 to-blue-400/35 blur-[90px] rounded-full pointer-events-none"></div>
      {/* ===================================================================== */}

      {/* Navbar Glassmorphism */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-8 md:px-16 py-5 bg-white/70 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            S
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">SMILE</h1>
            <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest">Inklusif Learning</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/signin"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 text-sm"
          >
            Masuk / Daftar
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">

        {/* Badge Estetik */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-8 shadow-sm hover:scale-105 transition-transform">
          <Sparkles size={16} className="text-indigo-600 animate-spin" />
          <span>Inovasi Pembelajaran AI Multimodal Inklusif</span>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Selamat Datang di <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">SMILE</span>
        </h2>

        <p className="text-slate-700 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          Platform pembelajaran interaktif berbasis <span className="text-indigo-950 font-bold bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200">AI Multimodal</span> yang dirancang khusus untuk memfasilitasi kolaborasi siswa disabilitas dengan mudah dan menyenangkan.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-xl shadow-indigo-950/5 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Aksen Gradiasi Halus */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradientBg} opacity-85 group-hover:opacity-100 transition-opacity`}></div>

              <div>
                <div className={`${item.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={28} />
                </div>
                <h3 className={`text-2xl font-extrabold mb-3 text-slate-900 ${item.accentColor} transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>

              <Link
                href="/signin"
                className="inline-flex items-center gap-2 font-bold text-sm text-blue-600 hover:text-indigo-600 group-hover:translate-x-1 transition-all"
              >
                <span>Mulai Sekarang</span> <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}