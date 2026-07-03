'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Volume2, Eye, ShieldCheck, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [jenisDisabilitas, setJenisDisabilitas] = useState('Tunanetra');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            jenis_disabilitas: jenisDisabilitas
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal melakukan registrasi.');

        setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
        setIsRegisterMode(false);
        setPassword('');
      } else {
        const res = await fetch('http://localhost:5000/api/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Username atau password salah.');

        setSuccessMsg('Login berhasil! Mengalihkan...');
        localStorage.setItem('user', JSON.stringify({
          username: username.trim(),
          jenis_disabilitas: jenisDisabilitas
        }));

        setTimeout(() => {
          if (jenisDisabilitas === 'Tunanetra') router.push('/tunanetra');
          else router.push('/tunarungu');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6 md:p-10 text-slate-900">

      {/* Latar Belakang Grid & Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[10%] w-[450px] h-[450px] bg-blue-400/25 blur-[90px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-400/25 blur-[90px] rounded-full pointer-events-none"></div>

      {/* Kontainer Utama Glassmorphism */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl border border-white/80 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12">

        {/* Sisi Kiri: Panel Informasi & Branding (5 Kolom) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-md group-hover:scale-105 transition-transform">S</div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight leading-none">SMILE</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-0.5">Inklusif Learning</p>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold mb-6">
              <Sparkles size={14} className="animate-spin" />
              <span>AI Multimodal Portal</span>
            </div>

            <h2 className="text-3xl font-black leading-tight mb-4">
              {isRegisterMode ? 'Mulai Perjalanan Belajarmu!' : 'Selamat Datang Kembali!'}
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">
              Akses materi pembelajaran interaktif yang disesuaikan khusus untuk kenyamanan dan kebutuhan aksesibilitasmu.
            </p>

            {/* Sorotan Aksesibilitas */}
            <div className="space-y-3.5 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <Volume2 className="w-5 h-5 text-blue-200 shrink-0" />
                <span className="text-xs font-bold">Dukungan Penuh Audio & Speech-to-Text</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <Eye className="w-5 h-5 text-purple-200 shrink-0" />
                <span className="text-xs font-bold">Deteksi Isyarat Visual & Teks Adaptif</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-indigo-200 font-semibold">
            <ShieldCheck size={16} />
            <span>Aman, Inklusif, & Mudah Digunakan</span>
          </div>
        </div>

        {/* Sisi Kanan: Form Input (7 Kolom) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">

          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900">
              {isRegisterMode ? 'Daftar Akun Baru' : 'Masuk ke Akun'}
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {isRegisterMode ? 'Isi data singkat di bawah untuk membuat akun.' : 'Masukkan kredensial akunmu untuk melajutkan.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between">
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-bold">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Nama Pengguna</label>
              <input
                className="w-full border-2 border-slate-200 bg-slate-50/50 p-3.5 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-slate-900 font-medium text-sm"
                type="text"
                placeholder="Contoh: siswa"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Kata Sandi</label>
              <input
                className="w-full border-2 border-slate-200 bg-slate-50/50 p-3.5 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-slate-900 font-medium text-sm"
                type="password"
                placeholder="Contoh: SMILE123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                {isRegisterMode ? 'Pilih Kebutuhan Layanan' : 'Mode Tujuan Dashboard'}
              </label>
              <select
                className="w-full border-2 border-slate-200 bg-slate-50/50 focus:bg-white p-3.5 rounded-2xl focus:border-indigo-600 outline-none transition-all text-slate-900 font-bold text-sm"
                value={jenisDisabilitas}
                onChange={(e) => setJenisDisabilitas(e.target.value)}
              >
                <option value="Tunanetra">Tunanetra (Fokus Audio & Suara)</option>
                <option value="Tunarungu">Tunarungu (Fokus Video & Isyarat)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}</span>
              )}
            </button>
          </form>

          {/* Switch Register/Login */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-bold text-sm transition-colors"
            >
              {isRegisterMode ? 'Sudah memiliki akun? Masuk di sini' : 'Belum memiliki akun? Daftar sekarang'}
            </button>
          </div>

          {/* Area Khusus Akses Cepat Demo (Menyelesaikan Masalah Double Mode) */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 text-center mb-3">
              ⚡ Akses Cepat Penguji (Demo Mode Tanpa Login)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/tunanetra" className="flex items-center justify-center gap-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-sm">
                <span>Demo Tunanetra</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/tunarungu" className="flex items-center justify-center gap-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-slate-200 hover:border-purple-300 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-sm">
                <span>Demo Tunarungu</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}