export default function DashboardTunarungu() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <header className="mb-10 border-b border-indigo-800 pb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-400">Dashboard Tunarungu</h1>
        <span className="bg-rose-500 px-4 py-1 rounded-full text-sm font-bold animate-pulse">
          Visual Mode Aktif
        </span>
      </header>

      <div className="mb-10 bg-slate-900 rounded-3xl p-6 border border-indigo-800 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-slate-300">Video Instruksi Terbaru</h2>
        <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border-2 border-indigo-500">
          <span className="text-6xl">▶️</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Lesson", icon: "📚", desc: "Materi dengan teks & video isyarat." },
          { title: "Talk Space", icon: "💬", desc: "Komunitas diskusi visual." },
          { title: "Quis Game", icon: "🎮", desc: "Kuis interaktif berbasis ikon." }
        ].map((item, index) => (
          <div key={index} className="bg-white/5 border border-indigo-500/30 p-8 rounded-3xl">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-indigo-300">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}