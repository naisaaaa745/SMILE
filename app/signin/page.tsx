import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ornamen Visual */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* Card Utama */}
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-5xl border border-white/20 z-10">
        
        {/* Header */}
        <header className="bg-indigo-600 p-6 -m-8 mb-8 rounded-t-3xl flex justify-between items-center text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">S</div>
            <div>
              <h1 className="text-xl font-bold">SMILE</h1>
              <p className="text-xs opacity-90">Inklusif Learning</p>
            </div>
          </div>
        </header>

        {/* Grid Konten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-4">
          
          {/* Sisi Kiri: Ilustrasi */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-800">Halo Teman SMILE !</h2>
            <p className="text-slate-600 mb-6">Mari masuk dan mulai petualangan belajarmu.</p>
            <div className="bg-slate-100 rounded-2xl p-6 h-72 flex items-center justify-center border-2 border-dashed border-slate-300">
              <span className="text-slate-400 font-medium">[Ilustrasi SMILE]</span>
            </div>
          </div>

          {/* Sisi Kanan: Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pengguna</label>
              <input className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all" type="text" placeholder="Masukkan nama..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <input className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all" type="password" placeholder="Masukkan sandi..." />
            </div>
            
            <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all">Masuk</button>
            
            <div className="relative text-center my-2">
                <span className="bg-white px-2 text-slate-400 text-sm">Atau</span>
            </div>
            
            <button className="border-2 border-slate-200 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all">Daftar dengan Google</button>
            
            {/* Navigasi Mode ke Dashboard */}
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/tunanetra">
                <button className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-all cursor-pointer">
                  Tunanetra
                </button>
              </Link>
              <Link href="/tunarungu">
                <button className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-all cursor-pointer">
                  Tunarungu
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}