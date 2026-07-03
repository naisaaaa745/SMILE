'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, MessageSquareText, Gamepad2, Volume2, VolumeX } from 'lucide-react';

export default function DashboardTunanetra() {
  const [isAudioActive, setIsAudioActive] = useState(true);

  const features = [
    { icon: BookOpen, title: "Lesson", desc: "Materi pembelajaran audio interaktif dengan berbagai topik menarik.", btn: "MULAI BELAJAR →", gradientBg: "from-blue-500 to-cyan-400", iconBg: "bg-blue-100/80 text-blue-700 border border-blue-200", link: "/lesson" },
    { icon: MessageSquareText, title: "Talk Space", desc: "Forum diskusi untuk berbagi ide dan pengalaman dengan sesama pengguna.", btn: "BUKA DISKUSI →", gradientBg: "from-purple-500 to-indigo-500", iconBg: "bg-purple-100/80 text-purple-700 border border-purple-200", link: "/talk-space" },
    { icon: Gamepad2, title: "Quis Game", desc: "Materi evaluasi pembelajaran audio interaktif berbasis gamifikasi.", btn: "MAIN SEKARANG →", gradientBg: "from-orange-500 to-amber-400", iconBg: "bg-orange-100/80 text-orange-700 border border-orange-200", link: "/quis-game" }
  ];

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 bg-white/70 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md">S</div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">SMILE <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Inklusif Learning</span></h1>
        </div>

        <button onClick={() => setIsAudioActive(!isAudioActive)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all ${isAudioActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
          {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span className="text-sm font-bold">{isAudioActive ? "Mode Audio Aktif" : "Mode Audio Nonaktif"}</span>
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-14 text-slate-900 tracking-tight text-center">
          Selamat Datang di Dashboard <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Tunanetra</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className="group relative bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-xl shadow-indigo-950/5 hover:shadow-2xl hover:-translate-y-1.5 transition-all h-full flex flex-col justify-between overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradientBg}`}></div>
                <div>
                  <div className={`${item.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 font-medium mb-8 leading-relaxed">{item.desc}</p>
                </div>
                <div className="font-extrabold text-blue-600 group-hover:text-indigo-600 transition-colors">{item.btn}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}