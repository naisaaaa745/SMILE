'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Save, Trash2, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function TalkSpaceTunarungu() {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [detectedSign, setDetectedSign] = useState<string>("Menunggu gerakan tangan...");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handLandmarker = useRef<HandLandmarker | null>(null);
    const animationFrameId = useRef<number | null>(null);

    // SOLUSI ANTI-CRASH: Menyimpan waktu frame video terakhir
    const lastVideoTimeRef = useRef<number>(-1);

    // 1. Inisialisasi Model AI MediaPipe
    useEffect(() => {
        async function loadModel() {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
                handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task` },
                    runningMode: "VIDEO",
                    numHands: 1, // Kita fokus 1 tangan dulu agar klasifikasi lebih akurat
                });
            } catch (err) {
                console.error("Gagal memuat model MediaPipe:", err);
            }
        }
        loadModel();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    // 2. LOGIKA DETEKSI BAHASA ISYARAT (Rule-Based Computer Vision)
    const translateGesture = (landmarks: any[]) => {
        // Titik ujung jari (Tip) vs Titik sendi bawah (PIP)
        const indexTip = landmarks[8];
        const indexPIP = landmarks[6];
        const middleTip = landmarks[12];
        const middlePIP = landmarks[10];
        const ringTip = landmarks[16];
        const ringPIP = landmarks[14];
        const pinkyTip = landmarks[20];
        const pinkyPIP = landmarks[18];
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];

        // Cek apakah jari mendongak ke atas (koordinat Y lebih kecil = lebih di atas layar)
        const isIndexOpen = indexTip.y < indexPIP.y;
        const isMiddleOpen = middleTip.y < middlePIP.y;
        const isRingOpen = ringTip.y < ringPIP.y;
        const isPinkyOpen = pinkyTip.y < pinkyPIP.y;
        const isThumbUp = thumbTip.y < landmarks[17].y && thumbTip.y < thumbIP.y;

        // Klasifikasi gerakan
        if (isIndexOpen && isMiddleOpen && isRingOpen && isPinkyOpen) {
            return "Halo / Hai 👋";
        } else if (!isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen && isThumbUp) {
            return "Bagus / Setuju 👍";
        } else if (isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen && isThumbUp) {
            return "Huruf L / Siap 👆";
        } else if (!isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen && !isThumbUp) {
            return "Mengepal (Huruf A / S) ✊";
        } else if (isIndexOpen && isMiddleOpen && !isRingOpen && !isPinkyOpen) {
            return "Damai / Peace ✌️";
        } else {
            return "Mendeteksi gerakan...";
        }
    };

    // 3. Aktifkan Kamera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setIsCameraActive(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    renderLoop();
                }
            }, 500);
        } catch (err) {
            alert("Gagal mengakses kamera.");
        }
    };

    // 4. Loop Frame Pemrosesan Gambar (DIPERBAIKI DENGAN FILTER FRAME)
    const renderLoop = () => {
        if (!videoRef.current || !canvasRef.current || !handLandmarker.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx && video.videoWidth > 0 && video.readyState >= 2) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // KUNCI PERBAIKAN: AI hanya mendeteksi JIKA frame dari kamera benar-benar baru berganti!
            if (video.currentTime !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = video.currentTime;

                const results = handLandmarker.current.detectForVideo(video, performance.now());
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (results.landmarks && results.landmarks.length > 0) {
                    const drawingUtils = new DrawingUtils(ctx);
                    for (const landmarks of results.landmarks) {
                        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#10B981", lineWidth: 5 });
                        drawingUtils.drawLandmarks(landmarks, { color: "#EF4444", lineWidth: 2 });

                        // Terjemahkan koordinat sendi tangan ke teks
                        const signText = translateGesture(landmarks);
                        setDetectedSign(signText);
                    }
                } else {
                    setDetectedSign("Arahkan tangan ke kamera...");
                }
            }
        }
        animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    // 5. Fitur Bicara (Kirim teks deteksi ke Backend TTS Flask)
    const speakDetectedSign = async () => {
        if (detectedSign.includes("Mendeteksi") || detectedSign.includes("Arahkan")) return;
        try {
            // Bersihkan emoji untuk dibacakan
            const cleanText = detectedSign.replace(/[\u1000-\uFFFF]+/g, '').trim();
            const res = await fetch('http://localhost:5000/api/talkspace/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: `Bahasa isyarat terdeteksi: ${cleanText}` })
            });
            const data = await res.json();
            if (res.ok && data.audio_url) {
                new Audio(data.audio_url).play();
            }
        } catch (err) {
            console.error("Gagal memutar suara:", err);
        }
    };

    return (
        <main className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-slate-900 p-6 md:p-12">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-6 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm">
                    <Link href="/tunanetra" className="flex items-center gap-2 text-blue-600 font-bold hover:text-indigo-600">
                        <ArrowLeft size={20} /> Kembali ke Dashboard
                    </Link>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-sm">Mode Deteksi Isyarat AI</span>
                </header>

                {!isCameraActive ? (
                    <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white shadow-xl text-center">
                        <h2 className="text-2xl font-black mb-2 text-slate-900">Mulai Komunikasi Visual</h2>
                        <p className="text-slate-600 mb-8 font-medium">Aktifkan kamera untuk mendeteksi gerakan bahasa isyarat secara real-time.</p>

                        <button onClick={startCamera} className="w-full h-64 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-3xl flex flex-col items-center justify-center text-indigo-600 font-extrabold transition-all mb-8 shadow-sm">
                            <Camera size={56} className="mb-4 animate-bounce" /> Klik untuk Aktifkan Kamera AI
                        </button>

                        <div className="flex justify-center gap-4">
                            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md"><Save size={18} /> Simpan Sesi</button>
                            <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50"><Trash2 size={18} /> Bersihkan</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">

                        {/* PANEL TERJEMAHAN REAL-TIME */}
                        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl mb-4 flex items-center justify-between shadow-md">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Terjemahan Isyarat:</p>
                                <h3 className="text-xl font-black mt-0.5">{detectedSign}</h3>
                            </div>
                            <button
                                onClick={speakDetectedSign}
                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-sm backdrop-blur-sm"
                                title="Bacakan dengan Audio"
                            >
                                <Volume2 size={20} /> <span className="hidden sm:inline">Bacakan</span>
                            </button>
                        </div>

                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-indigo-200 bg-black mb-6 shadow-inner">
                            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white px-8 py-3.5 rounded-2xl font-bold shadow-md transition-all">
                            Tutup Kamera
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}