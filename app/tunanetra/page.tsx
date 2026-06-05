'use client';
import { useState } from 'react'; // Tambahkan useState
import Link from 'next/link';
import { BookOpen, MessageSquareText, Gamepad2, Volume2, VolumeX } from 'lucide-react'; // Tambahkan VolumeX

export default function DashboardTunanetra() {
  const [isAudioActive, setIsAudioActive] = useState(true); // State untuk toggle audio

  const features = [
    { 
      icon: BookOpen, title: "Lesson", desc: "Materi pembelajaran audio interaktif dengan berbagai topik menarik.", 
      btn: "MULAI BELAJAR →", bgColor: "bg-blue-100", iconBg: "bg-blue-200", iconText: "text-blue-800", link: "/lesson" 
    },
    { 
      icon: MessageSquareText, title: "Talk Space", desc: "Forum diskusi untuk berbagi ide dan pengalaman dengan sesama pengguna.", 
      btn: "BUKA DISKUSI →", bgColor: "bg-purple-100", iconBg: "bg-purple-200", iconText: "text-purple-800", link: "/talk-space" 
    },
    { 
      icon: Gamepad2, title: "Quis Game", desc: "Materi pembelajaran audio interaktif dengan berbagai topik menarik.", 
      btn: "MAIN SEKARANG →", bgColor: "bg-orange-100", iconBg: "bg-orange-200", iconText: "text-orange-800", link: "/quis-game" 
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      <nav className="flex items-center justify-between px-10 py-6 bg-blue-100 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <h1 className="text-xl font-bold">SMILE <span className="block text-[10px] font-normal text-slate-600 uppercase tracking-widest">Inklusif Learning</span></h1>
        </div>

        {/* Tombol Toggle Audio yang bisa diklik */}
        <button 
          onClick={() => setIsAudioActive(!isAudioActive)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-md transition-all ${
            isAudioActive ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
          }`}
        >
          {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span className="text-sm font-bold">
            {isAudioActive ? "Mode Audio Aktif" : "Mode Audio Nonaktif"}
          </span>
        </button>
      </nav>

      {/* Main Content */}
      <section className="px-10 py-16 bg-blue-50/50">
        <h2 className="text-6xl font-extrabold mb-16 text-slate-900 tracking-tight">
          Selamat Datang di <span className="text-blue-600">SMILE</span> Inklusif Learning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className={`${item.bgColor} p-8 rounded-3xl border border-white shadow-md transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer h-full`}>
                <div className={`${item.iconBg} ${item.iconText} w-16 h-16 rounded-2xl flex items-center justify-center mb-8`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-700 mb-8 leading-relaxed font-medium">{item.desc}</p>
                <div className="text-blue-900 font-bold hover:underline">
                  {item.btn}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}