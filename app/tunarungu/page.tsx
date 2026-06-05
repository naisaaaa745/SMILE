'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Volume2, Eye, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function TalkSpaceTunarungu() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarker = useRef<HandLandmarker | null>(null);

  // 1. Inisialisasi Model AI
  useEffect(() => {
    async function loadModel() {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task` },
        runningMode: "VIDEO",
        numHands: 2,
      });
    }
    loadModel();
  }, []);

  // 2. Fungsi Aktifkan Kamera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(renderLoop);
        }
      }, 500);
    } catch (err) { alert("Gagal akses kamera"); }
  };

  // 3. Render Loop untuk Deteksi
  const renderLoop = () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current || !handLandmarker.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // SINKRONISASI UKURAN: Canvas harus mengikuti ukuran video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const results = handLandmarker.current.detectForVideo(video, performance.now());
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks) {
        const drawingUtils = new DrawingUtils(ctx);
        for (const landmarks of results.landmarks) {
          drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
          drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
        }
      }
    }
    if (isCameraActive) requestAnimationFrame(renderLoop);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/tunanetra" className="flex items-center gap-2 text-blue-700 font-bold mb-6">
          <ArrowLeft size={20}/> Kembali ke Dashboard
        </Link>

        {!isCameraActive ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Mulai Diskusi Baru</h2>
            <button onClick={startCamera} className="w-full h-64 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center text-blue-600 mb-6">
              <Camera size={48} className="mb-4"/> Klik untuk Aktifkan Kamera
            </button>
            <div className="flex gap-4">
              <button className="bg-yellow-400 px-6 py-2 rounded-xl font-bold"><Save size={18} className="inline mr-2"/> Simpan</button>
              <button className="bg-slate-200 px-6 py-2 rounded-xl font-bold"><Trash2 size={18} className="inline mr-2"/> Hapus</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* STACKING PENTING: Relative container, absolute children */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-blue-200 bg-black mb-6">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Tutup Kamera</button>
          </div>
        )}
      </div>
    </main>
  );
}