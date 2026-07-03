'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    setErrorMsg(''); setSuccessMsg('');
    if (!username.trim() || !password.trim()) { setErrorMsg('Nama pengguna dan kata sandi wajib diisi.'); return; }
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password: password.trim(), jenis_disabilitas: jenisDisabilitas })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal melakukan registrasi.');
        setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
        setIsRegisterMode(false); setPassword('');
      } else {
        const res = await fetch('http://localhost:5000/api/signin', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password: password.trim() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Username atau password salah.');
        setSuccessMsg('Login berhasil! Mengalihkan...');
        localStorage.setItem('user', JSON.stringify({ username: username.trim(), jenis_disabilitas: jenisDisabilitas }));
        setTimeout(() => {
          if (jenisDisabilitas === 'Tunanetra') router.push('/tunanetra');
          else router.push('/tunarungu');
        }, 1000);
      }
    } catch (err: any) { setErrorMsg(err.message || 'Terjadi kesalahan koneksi server.'); }
    finally { setIsLoading(false); }
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-indigo-400/25 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-white/80 relative z-10">
        <header className="flex items-center gap-3.5 mb-8 border-b border-slate-200/80 pb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">S</div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">SMILE</h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Inklusif Learning Portal</p>
          </div>
        </header>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {isRegisterMode ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}
        </h2>
        <p className="text-slate-600 mb-6 font-medium text-sm">
          {isRegisterMode ? 'Lengkapi data untuk memulai pembelajaran inklusif.' : 'Silakan masuk menggunakan akun yang telah terdaftar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-bold">{errorMsg}</div>}
          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-sm font-bold">{successMsg}</div>}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Pengguna</label>
            <input className="w-full border-2 border-slate-200 bg-white/80 p-3.5 rounded-2xl focus:border-indigo-600 outline-none font-medium transition-all" type="text" placeholder="Masukkan nama..." value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kata Sandi</label>
            <input className="w-full border-2 border-slate-200 bg-white/80 p-3.5 rounded-2xl focus:border-indigo-600 outline-none font-medium transition-all" type="password" placeholder="Masukkan sandi..." value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Mode Dashboard Pembelajaran</label>
            <select className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-2xl focus:border-indigo-600 outline-none font-bold text-slate-800" value={jenisDisabilitas} onChange={(e) => setJenisDisabilitas(e.target.value)}>
              <option value="Tunanetra">Tunanetra (Akses Audio & Suara)</option>
              <option value="Tunarungu">Tunarungu (Akses Video & Isyarat)</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2">
            {isLoading ? 'Memproses...' : isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}
          </button>

          <div className="text-center pt-4">
            <button type="button" onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); setSuccessMsg(''); }} className="text-indigo-600 font-bold text-sm hover:underline">
              {isRegisterMode ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar sekarang'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}