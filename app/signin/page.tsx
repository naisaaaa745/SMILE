'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [jenisDisabilitas, setJenisDisabilitas] = useState('Tunanetra');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }
    setIsLoading(true);

    try {
      const endpoint = isRegisterMode ? '/api/register' : '/api/signin';
      const bodyData = isRegisterMode
        ? { username: username.trim(), password: password.trim(), jenis_disabilitas: jenisDisabilitas }
        : { username: username.trim(), password: password.trim() };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan otentikasi.');

      setSuccessMsg(isRegisterMode ? 'Pendaftaran berhasil! Silakan masuk.' : 'Login berhasil! Mengalihkan...');
      if (isRegisterMode) {
        setIsRegisterMode(false);
        setPassword('');
      } else {
        localStorage.setItem('user', JSON.stringify({ username: username.trim(), jenis_disabilitas: jenisDisabilitas }));
        setTimeout(() => {
          router.push(jenisDisabilitas === 'Tunanetra' ? '/tunanetra' : '/tunarungu');
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" aria-hidden="true"></div>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl border border-white/80 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12">

        {/* Sisi Kiri: Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-10 text-white flex flex-col justify-between" aria-hidden="true">
          <div>
            <div className="inline-flex items-center gap-3 mb-10">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-md">S</div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">SMILE</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-0.5">Inklusif Learning</p>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight mb-4">{isRegisterMode ? 'Mulai Perjalanan Belajarmu!' : 'Selamat Datang Kembali!'}</h2>

            {/* Area Gambar Tanpa Border */}
            <div className="w-full h-56 relative my-8 rounded-2xl overflow-hidden shadow-inner">
              <Image
                src="/sign-in.png"
                alt="Ilustrasi Pembelajaran Inklusif"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">Platform adaptif berbasis AI untuk disabilitas visual dan rungu.</p>
          </div>
          <div className="mt-10 flex items-center gap-2 text-xs text-indigo-200 font-semibold">
            <ShieldCheck size={16} /><span>Aman, Inklusif, & Mudah Digunakan</span>
          </div>
        </div>

        {/* Sisi Kanan: Form */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center" role="main">
          <h3 className="text-2xl font-black text-slate-900 mb-6">{isRegisterMode ? 'Daftar Akun Baru' : 'Masuk ke Akun'}</h3>
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {errorMsg && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold">{errorMsg}</div>}
            {successMsg && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-bold">{successMsg}</div>}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">Nama Pengguna</label>
              <input className="w-full border-2 border-slate-200 bg-slate-50/50 p-3.5 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-slate-900 font-medium text-sm" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">Kata Sandi</label>
              <input className="w-full border-2 border-slate-200 bg-slate-50/50 p-3.5 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none text-slate-900 font-medium text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">Kebutuhan Aksesibilitas</label>
              <select className="w-full border-2 border-slate-200 bg-slate-50/50 p-3.5 rounded-2xl focus:border-indigo-600 outline-none text-slate-900 font-bold text-sm" value={jenisDisabilitas} onChange={(e) => setJenisDisabilitas(e.target.value)}>
                <option value="Tunanetra">Tunanetra (Navigasi Suara)</option>
                <option value="Tunarungu">Tunarungu (Visual & Isyarat)</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all mt-2 flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <span>{isRegisterMode ? 'Daftar' : 'Masuk'}</span>}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <button onClick={() => setIsRegisterMode(!isRegisterMode)} className="text-indigo-600 font-bold text-sm hover:underline">
              {isRegisterMode ? 'Sudah memiliki akun? Masuk' : 'Belum memiliki akun? Daftar'}
            </button>
          </div>

          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <p className="text-[11px] font-extrabold uppercase text-slate-500 text-center mb-3">⚡ Akses Cepat Penguji</p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/tunanetra" className="flex items-center justify-center bg-white text-blue-700 border border-slate-200 py-2.5 rounded-xl text-xs font-bold shadow-sm">Demo Tunanetra</Link>
              <Link href="/tunarungu" className="flex items-center justify-center bg-white text-purple-700 border border-slate-200 py-2.5 rounded-xl text-xs font-bold shadow-sm">Demo Tunarungu</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}