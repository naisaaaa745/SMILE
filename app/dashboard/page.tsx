import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar Dashboard */}
      <header className="flex justify-between items-center p-8 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">S</div>
          <h1 className="text-xl font-bold">SMILE Dashboard</h1>
        </div>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="text-indigo-400">Home</Link>
          <Link href="/" className="hover:text-indigo-400">Logout</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="p-12 mt-10">
        <h2 className="text-5xl font-bold mb-6 text-indigo-400">Selamat Datang di SMILE Inklusif Learning</h2>
        <p className="text-slate-400 text-lg max-w-xl mb-12">
          Platform pembelajaran interaktif yang dirancang khusus untuk anak disabilitas dengan teknologi audio dan aksesibilitas terdepan.
        </p>

        {/* Grid Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Lesson", href: "/lesson", desc: "Materi pembelajaran interaktif dengan berbagai topik menarik." },
            { title: "Talk Space", href: "/talk-space", desc: "Forum diskusi untuk berbagi ide dan pengalaman dengan sesama pengguna." },
            { title: "Quis Game", href: "/quis-game", desc: "Uji pemahamanmu melalui permainan edukatif yang menyenangkan." }
          ].map((item) => (
            <div key={item.title} className="bg-indigo-900/40 p-8 rounded-3xl border border-indigo-500/30">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 mb-6">{item.desc}</p>
              <Link href={item.href} className="text-teal-400 font-bold hover:underline">
                Mulai Sekarang →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}