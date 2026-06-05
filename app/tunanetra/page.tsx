export default function DashboardTunanetra() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <header className="mb-10 border-b border-indigo-800 pb-6">
        <h1 className="text-4xl font-bold text-indigo-400">Dashboard Tunanetra</h1>
        <button className="mt-4 bg-teal-600 px-6 py-2 rounded-full font-bold">
          🔊 Mode Suara Aktif
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Lesson", desc: "Materi pembelajaran audio interaktif." },
          { title: "Talk Space", desc: "Forum diskusi bersama sesama pengguna." },
          { title: "Quis Game", desc: "Game kuis seru berbasis suara." }
        ].map((item, index) => (
          <button 
            key={index}
            className="bg-indigo-900/50 border-2 border-indigo-500 p-8 rounded-3xl text-left hover:bg-indigo-800 transition-all focus:ring-4 focus:ring-teal-400"
            aria-label={`Menu ${item.title}. ${item.desc}`}
          >
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-300">{item.desc}</p>
          </button>
        ))}
      </div>
    </main>
  );
}