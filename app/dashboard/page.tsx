'use client'; // Pastikan pakai 'use client' karena ada interaksi hook
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    // Implementasi Navigasi Suara
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'id-ID';
            recognition.continuous = true;
            recognition.start();

            recognition.onresult = (event: any) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                if (command.includes("lesson")) router.push('/lesson');
                if (command.includes("kuis")) router.push('/quis-game');
                if (command.includes("diskusi")) router.push('/talk-space');
            };
        }
    }, [router]);

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* Navbar Dashboard */}
            <header className="flex justify-between items-center p-8 border-b border-indigo-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold" aria-hidden="true">S</div>
                    <h1 className="text-xl font-bold">SMILE Dashboard</h1>
                </div>
                <nav className="flex gap-6 text-sm font-medium">
                    <Link href="/dashboard" aria-label="Halaman Beranda">Home</Link>
                    <Link href="/" aria-label="Keluar dari akun">Logout</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="p-12 mt-10">
                <h2 className="text-5xl font-bold mb-6 text-indigo-400">Selamat Datang di SMILE Inklusif Learning</h2>
                <p className="text-slate-400 text-lg max-w-xl mb-12">
                    Platform pembelajaran interaktif yang dirancang khusus untuk anak disabilitas.
                    Gunakan perintah suara seperti "Buka Lesson", "Buka Kuis", atau "Buka Diskusi" untuk bernavigasi.
                </p>

                {/* Grid Menu dengan aria-label */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Lesson", href: "/lesson", desc: "Materi pembelajaran interaktif.", aria: "Buka menu materi pembelajaran" },
                        { title: "Talk Space", href: "/talk-space", desc: "Forum diskusi berbagi ide.", aria: "Buka menu forum diskusi" },
                        { title: "Quis Game", href: "/quis-game", desc: "Uji pemahaman melalui permainan.", aria: "Buka menu permainan kuis" }
                    ].map((item) => (
                        <div key={item.title} className="bg-indigo-900/40 p-8 rounded-3xl border border-indigo-500/30">
                            <div className="text-4xl mb-4" aria-hidden="true">⭐</div>
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-slate-400 mb-6">{item.desc}</p>
                            <Link
                                href={item.href}
                                className="text-teal-400 font-bold hover:underline"
                                aria-label={item.aria}
                            >
                                Mulai Sekarang →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}