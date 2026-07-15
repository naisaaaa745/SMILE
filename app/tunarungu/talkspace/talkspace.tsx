'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, BookCheck, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const SYLLABUS = [
    { id: "HUJAN_LEBAT", title: "Modul 1: Hujan Lebat", instruction: "Buka telapak tanganmu lebar-lebar (5 jari terbuka)." },
    { id: "BANJIR", title: "Modul 2: Bahaya Banjir", instruction: "Genggam tanganmu (Mengepal rapat)." }
];

export default function TalkSpaceKameraTunarungu() {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [feedbackText, setFeedbackText] = useState("Menunggu isyarat tangan...");

    const videoRef = useRef<HTMLVideoElement>(null);
    const handLandmarker = useRef<HandLandmarker | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);

    // Load Model AI
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

    // Pasang Stream Kamera dengan Aman (Anti Black Screen)
    useEffect(() => {
        if (isCameraActive && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                renderLoop();
            };
        }
    }, [isCameraActive, mediaStream]);

    const renderLoop = () => {
        if (!videoRef.current || !handLandmarker.current) return;

        const video = videoRef.current;
        if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;
            const results = handLandmarker.current.detectForVideo(video, performance.now());

            if (results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];
                const isIndexOpen = landmarks[8].y < landmarks[6].y;
                const isMiddleOpen = landmarks[12].y < landmarks[10].y;
                const isRingOpen = landmarks[16].y < landmarks[14].y;
                const isPinkyOpen = landmarks[20].y < landmarks[18].y;

                let detectedGesture = "BANTUAN";
                if (isIndexOpen && isMiddleOpen && isRingOpen && isPinkyOpen) detectedGesture = "HUJAN_LEBAT";
                else if (!isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen) detectedGesture = "BANJIR";

                const currentTarget = SYLLABUS[currentModuleIndex]?.id;

                if (detectedGesture === currentTarget) {
                    setFeedbackText(`✅ Bagus! Isyarat terdeteksi.`);
                    if (currentModuleIndex < SYLLABUS.length - 1) {
                        setTimeout(() => {
                            setCurrentModuleIndex(prev => prev + 1);
                            setFeedbackText("Menunggu isyarat tangan...");
                        }, 2000);
                    } else {
                        setFeedbackText("🎉 Semua modul selesai!");
                    }
                }
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

    const currentModule = SYLLABUS[currentModuleIndex] || SYLLABUS[0];

    return (
        <main className="min-h-screen bg-slate-50/50 p-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100 mb-10">
                    <Link href="/tunarungu" className="font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
                        Dashboard
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Panel Modul */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">{currentModule.title}</h2>

                        <div className="flex-1 min-h-[250px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 mb-6">
                            <PlayCircle size={64} className="text-blue-200 mb-2" />
                        </div>

                        <p className="text-slate-800 font-medium">{currentModule.instruction}</p>
                    </div>

                    {/* Panel Kamera */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
                        {!isCameraActive ? (
                            <button onClick={startCamera} className="w-full h-full min-h-[350px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50/50 font-bold text-lg transition-all">
                                <Camera size={56} className="mb-4" /> Klik Untuk Mulai
                            </button>
                        ) : (
                            <div className="w-full flex flex-col h-full">
                                <div className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-center shadow-sm mb-4">
                                    {feedbackText}
                                </div>
                                <div className="relative w-full flex-1 aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}