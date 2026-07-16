'use client';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageSquareText, Gamepad2, ArrowRight } from 'lucide-react';

export default function DashboardTunarungu() {
  const features = [
    {
      title: "Lesson",
      desc: "Materi pembelajaran interaktif dengan integrasi teks dan panduan audio pemandu.",
      icon: BookOpen,
      link: "/lesson",
      gradientBg: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-100/80 text-blue-700 border border-blue-200",
    },
    {
      title: "Talk Space",
      desc: "Ruang komunikasi dua arah inklusif dengan teknologi AI Multimodal.",
      icon: MessageSquareText,
      link: "/tunarungu/talk-space",
      gradientBg: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-100/80 text-purple-700 border border-purple-200",
    },
    {
      title: "Quis Game",
      desc: "Evaluasi pembelajaran berbasis gamifikasi interaktif yang menyenangkan.",
      icon: Gamepad2,
      link: "/quis-game",
      gradientBg: "from-orange-500 to-amber-400",
      iconBg: "bg-orange-100/80 text-orange-700 border border-orange-200",
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header dengan Gambar */}
        <div className="bg-white/70 backdrop-blur-md px-8 py-10 rounded-3xl shadow-xl shadow-indigo-950/5 border border-white/60 mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Dashboard Tunarungu</h1>

          {/* Area Gambar: mt-8 memberi jarak, overflow-hidden memastikan zoom rapi */}
          <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg relative bg-white/50 mt-8 border border-white/50">
            <Image
              src="/dashboard-tunarungu.png"
              alt="Ilustrasi Tunarungu"
              fill
              // object-cover + scale-105 memberikan efek zoom yang elegan tanpa memotong subjek utama
              className="object-cover scale-105"
            />
          </div>
        </div>

        {/* Grid Menu Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div key={index} className="group relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-950/5 border border-white/80 p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradientBg} rounded-t-3xl`}></div>
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${item.iconBg}`}>
                  <item.icon size={30} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>
              <Link href={item.link} className="inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                Mulai Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}