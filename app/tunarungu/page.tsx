'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, BookCheck, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Modul Kurikulum
const SYLLABUS = [
  { id: "HUJAN_LEBAT", title: "Modul 1: Hujan Lebat", instruction: "Peragakan isyarat 'Hujan Lebat' untuk menyelesaikan modul ini." },
  { id: "BANJIR", title: "Modul 2: Bahaya Banjir", instruction: "Peragakan isyarat 'Banjir' untuk lanjut ke tahap evaluasi." }
];

export default function LearningPathTunarungu() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState("Menunggu isyarat tangan...");
  const videoRef = useRef<HTMLVideoElement>(null);
  const handLandmarker = useRef<HandLandmarker | null>(null);

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

  const renderLoop = () => {
    if (!videoRef.current || !handLandmarker.current) return;
    if (videoRef.current.readyState >= 2) {
      const results = handLandmarker.current.detectForVideo(videoRef.current, performance.now());
      if (results.landmarks.length > 0) {
        const landmark = results.landmarks[0][0];
        const currentTarget = SYLLABUS[currentModuleIndex].id;

        // Logika Evaluasi Pemahaman (Dummy Validation)
        let detected = "";
        if (landmark.y < 0.3) detected = "HUJAN_LEBAT";
        else if (landmark.x > 0.7) detected = "BANJIR";

        if (detected === currentTarget) {
          setFeedbackText(`Hebat! Isyarat ${currentTarget} tepat.`);
          if (currentModuleIndex < SYLLABUS.length - 1) {
            setTimeout(() => setCurrentModuleIndex(prev => prev + 1), 2000);
          }
        } else {
          setFeedbackText("Gerakan belum tepat, ikuti peragaan Avatar 3D.");
        }
      }
    }
    if (isCameraActive) requestAnimationFrame(renderLoop);
  };

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
    } catch (err) { alert("Akses kamera ditolak."); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm">
          <Link href="/signin" className="flex items-center gap-2 text-indigo-700 font-bold hover:underline">
            <ArrowLeft size={20} /> Dashboard
          </Link>
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-xs">Learning Path: Mitigasi Bencana</span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel Edukasi & Avatar 3D */}
          <div className="bg-white/90 p-8 rounded-3xl shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <BookCheck className="text-indigo-600" size={28} />
              <h2 className="text-2xl font-black text-slate-900">{SYLLABUS[currentModuleIndex].title}</h2>
            </div>

            {/* Placeholder Avatar 3D Interaktif */}
            <div className="flex-1 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <PlayCircle size={64} className="text-white/80 relative z-10 group-hover:scale-110 transition-transform cursor-pointer" />
              <p className="text-white font-bold mt-4 relative z-10">Avatar 3D Memperagakan Materi</p>
            </div>

            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
              <p className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-2">Instruksi Tugas</p>
              <p className="text-lg font-medium text-slate-700">{SYLLABUS[currentModuleIndex].instruction}</p>
            </div>
          </div>

          {/* Panel Evaluasi (Kamera) */}
          <div className="bg-white/90 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center">
            {!isCameraActive ? (
              <button onClick={startCamera} className="w-full h-full min-h-[300px] border-4 border-dashed border-indigo-300 rounded-3xl flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 font-bold text-lg transition-all">
                <Camera size={56} className="mb-4" /> Mulai Evaluasi Isyarat
              </button>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl font-bold text-center mb-6 shadow-md">
                  Status: {feedbackText}
                </div>
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border-4 border-slate-200 shadow-inner">
                  <video ref={videoRef} className="w-full h-full object-cover mirror" autoPlay playsInline muted />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}