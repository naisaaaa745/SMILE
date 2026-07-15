'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Volume2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

const MATERI_MITIGASI = {
    HUJAN: { label: "Hujan Lebat 🌧️", tip: "MITIGASI: Jauhi pohon besar & tiang listrik. Segera cari tempat berteduh!" },
    KEKERINGAN: { label: "Kekeringan ☀️", tip: "MITIGASI: Hemat air & simpan cadangan air bersih dengan rapat." }
};

export default function TalkSpaceTunarungu() {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [detectedSign, setDetectedSign] = useState("Menunggu gerakan...");
    const [mitigationTip, setMitigationTip] = useState("");
    const [lastSpoken, setLastSpoken] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handLandmarker = useRef<HandLandmarker | null>(null);
    const animationFrameId = useRef<number | null>(null);

    const lastProcessedTimestampRef = useRef<number>(-1);
    const isProcessingRef = useRef<boolean>(false);

    useEffect(() => {
        async function loadModel() {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
                handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task` },
                    runningMode: "VIDEO",
                });
            } catch (err) { console.error("Gagal memuat model:", err); }
        }
        loadModel();
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, []);

    const translateGesture = (landmarks: any[]) => {
        const isIndexOpen = landmarks[8].y < landmarks[6].y;
        const isMiddleOpen = landmarks[12].y < landmarks[10].y;
        if (isIndexOpen && isMiddleOpen) return MATERI_MITIGASI.HUJAN;
        if (!isIndexOpen && !isMiddleOpen) return MATERI_MITIGASI.KEKERINGAN;
        return { label: "Mendeteksi...", tip: "" };
    };

    const speakMitigation = (text: string) => {
        if (!text || text === lastSpoken) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        setLastSpoken(text);
    };

    const renderLoop = () => {
        if (!videoRef.current || !canvasRef.current || !handLandmarker.current) return;
        if (isProcessingRef.current) {
            animationFrameId.current = requestAnimationFrame(renderLoop);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx && video.readyState >= 2) {
            isProcessingRef.current = true;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const currentTimestamp = Math.floor(video.currentTime * 1000);

            if (currentTimestamp > lastProcessedTimestampRef.current) {
                lastProcessedTimestampRef.current = currentTimestamp;
                try {
                    if (handLandmarker.current) {
                        const results = handLandmarker.current.detectForVideo(video, currentTimestamp);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        if (results.landmarks && results.landmarks.length > 0) {
                            const drawingUtils = new DrawingUtils(ctx);
                            drawingUtils.drawConnectors(results.landmarks[0], HandLandmarker.HAND_CONNECTIONS, { color: "#10B981", lineWidth: 5 });
                            const data = translateGesture(results.landmarks[0]);
                            if (data.label !== "Mendeteksi...") {
                                setDetectedSign(data.label);
                                setMitigationTip(data.tip);
                                speakMitigation(data.tip);
                            }
                        }
                    }
                } catch (e) { console.warn("Frame skipped"); }
            }
            isProcessingRef.current = false;
        }
        animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setIsCameraActive(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().then(() => renderLoop());
                    };
                }
            }, 300);
        } catch (err) { alert("Pastikan izin kamera sudah di-Allow di gembok browser."); }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                    <Link href="/tunarungu" className="flex items-center gap-2 font-bold text-indigo-600">
                        <ArrowLeft /> Kembali ke Dashboard
                    </Link>
                </header>

                {!isCameraActive ? (
                    <button onClick={startCamera} className="w-full h-64 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 transition-colors">
                        <Camera size={48} className="mb-2" /> Aktifkan Kamera Simulasi
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg">
                            <h1 className="text-3xl font-black">{detectedSign}</h1>
                        </div>
                        {mitigationTip && (
                            <div className="bg-amber-100 p-5 rounded-2xl flex items-start gap-4">
                                <AlertTriangle className="text-amber-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-amber-900">Instruksi Keselamatan:</h4>
                                    <p className="text-amber-800 text-sm">{mitigationTip}</p>
                                </div>
                            </div>
                        )}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-4 border-white shadow-2xl">
                            <video
                                ref={videoRef} autoPlay playsInline muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}