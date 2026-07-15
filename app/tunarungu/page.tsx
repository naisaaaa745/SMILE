'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Languages, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Mapping 5 Gerakan Mitigasi Cuaca Ekstrem
const MITIGASI_GESTURES: { [key: string]: string } = {
  "HUJAN_LEBAT": "Hujan Lebat: Hindari pohon besar dan papan reklame!",
  "BANJIR": "Banjir: Segera evakuasi ke tempat yang lebih tinggi!",
  "ANGIN_KENCANG": "Angin Kencang: Masuk ke dalam rumah dan tutup jendela!",
  "PETIR": "Petir: Matikan perangkat elektronik dan jangan di tempat terbuka!",
  "BANTUAN": "Bantuan: Tetap tenang, tim SAR sedang dalam perjalanan."
};

export default function TalkSpaceTunarungu() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedText, setDetectedText] = useState("Menunggu gerakan...");
  const videoRef = useRef<HTMLVideoElement>(null);
  const handLandmarker = useRef<HandLandmarker | null>(null);

  // 1. Inisialisasi Model AI
  useEffect(() => {
    async function loadModel() {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task` },
        runningMode: "VIDEO",
        numHands: 1,
      });
    }
    loadModel();
  }, []);

  // 2. Fungsi Jembatan AI (Text-to-Speech untuk Tunanetra)
  const speakTranslation = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 3. Logika Deteksi
  const renderLoop = () => {
    if (!isCameraActive || !videoRef.current || !handLandmarker.current) return;

    const results = handLandmarker.current.detectForVideo(videoRef.current, performance.now());

    if (results.landmarks.length > 0) {
      const landmark = results.landmarks[0][0];

      // Logika klasifikasi berdasarkan posisi tangan (untuk demo sekolah)
      let resultKey = "BANTUAN";
      if (landmark.y < 0.3) resultKey = "HUJAN_LEBAT";
      else if (landmark.x > 0.7) resultKey = "BANJIR";
      else if (landmark.x < 0.3) resultKey = "ANGIN_KENCANG";
      else if (landmark.y > 0.7) resultKey = "PETIR";

      const message = MITIGASI_GESTURES[resultKey];
      setDetectedText(message);
      speakTranslation(message);
    }

    if (isCameraActive) requestAnimationFrame(renderLoop);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(renderLoop);
      }
    } catch (err) {
      alert("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/talk-space" className="flex items-center gap-2 text-indigo-700 font-bold mb-6">
          <ArrowLeft size={20} /> Kembali ke Ruang Kolaborasi
        </Link>

        {/* Panel Info Inklusi */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-100 mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Languages className="text-indigo-600" /> Jembatan Komunikasi AI
          </h2>
          <div className="bg-indigo-50 p-4 rounded-xl text-indigo-900 font-bold text-center border-2 border-indigo-200">
            {detectedText}
          </div>
        </div>

        {/* Kamera & Deteksi */}
        {!isCameraActive ? (
          <button onClick={startCamera} className="w-full h-64 border-4 border-dashed border-indigo-300 rounded-3xl flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all">
            <Camera size={48} className="mb-4" /> Klik untuk Mulai Isyarat Cuaca Ekstrem
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black mb-4 border-4 border-indigo-500">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            </div>
            <p className="text-sm text-slate-500 mb-4 text-center">Sistem mendeteksi isyarat mitigasi cuaca ekstrem secara real-time.</p>
            <button onClick={() => window.location.reload()} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-500 transition-all">
              Selesai & Keluar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}