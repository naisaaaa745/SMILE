'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function TalkSpaceKameraTunarungu() {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [feedbackText, setFeedbackText] = useState("Menunggu isyarat tangan...");

    const videoRef = useRef<HTMLVideoElement>(null);
    const handLandmarker = useRef<HandLandmarker | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);

    // Load Model AI MediaPipe
    useEffect(() => {
        async function loadModel() {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
                handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task` },
                    runningMode: "VIDEO",
                    numHands: 1,
                });
            } catch (err) { console.error(err); }
        }
        loadModel();
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, []);

    // Pasang Stream Kamera
    useEffect(() => {
        if (isCameraActive && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                renderLoop();
            };
        }
    }, [isCameraActive, mediaStream]);

    // Logika Deteksi Isyarat Real-Time
    const renderLoop = () => {
        if (!videoRef.current || !handLandmarker.current) return;

        const video = videoRef.current;
        if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;
            const results = handLandmarker.current.detectForVideo(video, performance.now());

            if (results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];
                // Cek apakah jari terbuka atau tertutup
                const isIndexOpen = landmarks[8].y < landmarks[6].y;
                const isMiddleOpen = landmarks[12].y < landmarks[10].y;
                const isRingOpen = landmarks[16].y < landmarks[14].y;
                const isPinkyOpen = landmarks[20].y < landmarks[18].y;

                let detectedGesture = "Tidak Dikenali";

                // 5 Jari Terbuka = Hujan Lebat
                if (isIndexOpen && isMiddleOpen && isRingOpen && isPinkyOpen) {
                    detectedGesture = "Hujan Lebat";
                }
                // Semua Jari Mengepal = Banjir
                else if (!isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen) {
                    detectedGesture = "Banjir";
                }

                setFeedbackText(`[Isyarat Terdeteksi]: ${detectedGesture}`);
            } else {
                // Jika tidak ada tangan di kamera
                setFeedbackText("Menunggu isyarat tangan...");
            }
        }
        animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            setIsCameraActive(true);
        } catch (err) {
            alert("Akses kamera ditolak atau tidak ditemukan.");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 font-sans relative overflow-hidden">
            {/* Latar Belakang Estetik */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
                    <Link href="/tunarungu" className="font-bold text-indigo-700 hover:text-indigo-900 transition-colors flex items-center gap-2">
                        <ArrowLeft size={20} /> Kembali ke Dashboard
                    </Link>
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-xs">
                        Penerjemah Bahasa Isyarat AI
                    </span>
                </header>

                {/* Panel Kamera Utama (Full Width) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
                    {!isCameraActive ? (
                        <button
                            onClick={startCamera}
                            className="w-full h-full min-h-[400px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50/50 font-bold text-xl transition-all"
                        >
                            <Camera size={64} className="mb-6 text-blue-500" />
                            Klik Untuk Mulai Penerjemah
                        </button>
                    ) : (
                        <div className="w-full flex flex-col h-full">
                            <div className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-center text-xl shadow-sm mb-6 transition-colors">
                                {feedbackText}
                            </div>
                            <div className="relative w-full flex-1 aspect-video rounded-3xl overflow-hidden bg-black shadow-inner border-4 border-slate-100">
                                {/* Efek cermin ditambahkan dengan -scale-x-100 */}
                                <video
                                    ref={videoRef}
                                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}