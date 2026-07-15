'use client';
import Link from 'next/link';
import { BookOpen, MessageSquareText, Gamepad2, ArrowRight } from 'lucide-react';

export default function DashboardTunarungu() {
  const features = [
    {
      title: "Lesson",
      desc: "Materi pembelajaran interaktif dengan integrasi teks dan panduan audio pemandu.",
      icon: BookOpen,
      link: "/lesson",
      iconBg: "bg-blue-100 text-blue-600",
      topBorder: "border-t-4 border-t-blue-400"
    },
    {
      title: "Talk Space",
      desc: "Ruang komunikasi dua arah inklusif dengan teknologi AI Multimodal.",
      icon: MessageSquareText,
      link: "/tunarungu/talk-space", // Mengarah ke halaman kamera
      iconBg: "bg-purple-100 text-purple-600",
      topBorder: "border-t-4 border-t-purple-400"
    },
    {
      title: "Quis Game",
      desc: "Evaluasi pembelajaran berbasis gamifikasi interaktif yang menyenangkan.",
      icon: Gamepad2,
      link: "/quis-game",
      iconBg: "bg-orange-100 text-orange-600",
      topBorder: "border-t-4 border-t-orange-400"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Sederhana */}
        <div className="bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100 mb-10">
          <h1 className="text-xl font-bold text-indigo-700">Dashboard</h1>
        </div>

        {/* Grid Menu Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div key={index} className={`bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between h-full hover:shadow-md transition-shadow ${item.topBorder}`}>
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}>
                  <item.icon size={28} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>

              <Link href={item.link} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                Mulai Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}