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
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Pendaftaran Akun Baru
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
        if (!res.ok) {
          throw new Error(data.message || 'Gagal melakukan registrasi.');
        }

        setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
        setIsRegisterMode(false); // Alihkan ke mode masuk setelah sukses
        setPassword(''); // Reset password field
      } else {
        // Masuk Akun
        const res = await fetch('http://localhost:5000/api/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Username atau password salah.');
        }

        // Cari tahu info disabilitas user yang baru login
        // Karena API signin tidak mengembalikan jenis_disabilitas secara langsung pada schema default, 
        // kita arahkan pengguna ke dashboard berdasarkan pilihan yang dicocokkan atau opsi default.
        // Untuk menjaga fleksibilitas, mari gunakan jenisDisabilitas default dari state atau buat fallback
        setSuccessMsg('Login berhasil! Mengalihkan...');
        
        // Simpan sesi ke localStorage
        localStorage.setItem('user', JSON.stringify({
          username: username.trim(),
          jenis_disabilitas: jenisDisabilitas // default atau dipilih
        }));

        setTimeout(() => {
          if (jenisDisabilitas === 'Tunanetra') {
            router.push('/tunanetra');
          } else {
            router.push('/tunarungu');
          }
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">S</div>
            <div>
              <h1 className="text-xl font-bold">SMILE</h1>
              <p className="text-xs opacity-90">Inklusif Learning</p>
            </div>
          </Link>
        </header>

        {/* Grid Konten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-4">
          
          {/* Sisi Kiri: Ilustrasi */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-800">
              {isRegisterMode ? 'Gabung SMILE !' : 'Halo Teman SMILE !'}
            </h2>
            <p className="text-slate-600 mb-6">
              {isRegisterMode ? 'Mulai buat akun belajarmu hari ini.' : 'Mari masuk dan mulai petualangan belajarmu.'}
            </p>
            <div className="bg-slate-100 rounded-2xl p-6 h-72 flex items-center justify-center border-2 border-dashed border-slate-300">
              <span className="text-slate-400 font-medium text-lg">[Ilustrasi SMILE]</span>
            </div>
          </div>

          {/* Sisi Kanan: Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Alert Error */}
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Alert Success */}
            {successMsg && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pengguna</label>
              <input 
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-900" 
                type="text" 
                placeholder="Masukkan nama..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <input 
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-900" 
                type="password" 
                placeholder="Masukkan sandi..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Dropdown Jenis Disabilitas (Hanya tampil saat Register atau untuk mengarahkan rute dashboard) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {isRegisterMode ? 'Jenis Disabilitas' : 'Mode Dashboard Pembelajaran'}
              </label>
              <select 
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                value={jenisDisabilitas}
                onChange={(e) => setJenisDisabilitas(e.target.value)}
              >
                <option value="Tunanetra">Tunanetra (Akses Audio & Suara)</option>
                <option value="Tunarungu">Tunarungu (Akses Video & Isyarat)</option>
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : isRegisterMode ? 'Daftar Akun Baru' : 'Masuk'}
            </button>
            
            <div className="relative text-center my-2">
              <span className="bg-white px-2 text-slate-400 text-sm">Atau</span>
            </div>
            
            <button 
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="border-2 border-slate-200 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all text-slate-700"
            >
              {isRegisterMode ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar Sekarang'}
            </button>
            
            {/* Quick Navigation Mode ke Dashboard */}
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/tunanetra">
                <span className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-all cursor-pointer inline-block text-center">
                  Dashboard Tunanetra
                </span>
              </Link>
              <Link href="/tunarungu">
                <span className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-all cursor-pointer inline-block text-center">
                  Dashboard Tunarungu
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}