'use client';
import { useState, useEffect } from 'react';

export default function QuizPage() {
  // Daftar 10 Soal
  const daftarSoal = [
    { id: 1, pertanyaan: "Apa indikator utama cuaca ekstrem?", opsiA: "Langit cerah", opsiB: "Awan gelap", jawaban: "b" },
    { id: 2, pertanyaan: "Tindakan saat terjadi gempa?", opsiA: "Lari keluar", opsiB: "Berlindung di bawah meja", jawaban: "b" },
    { id: 3, pertanyaan: "Berapa titik didih air?", opsiA: "100 derajat", opsiB: "50 derajat", jawaban: "a" },
    { id: 4, pertanyaan: "Ibukota Indonesia?", opsiA: "Jakarta", opsiB: "Bandung", jawaban: "a" },
    { id: 5, pertanyaan: "Planet terbesar?", opsiA: "Bumi", opsiB: "Jupiter", jawaban: "b" },
    { id: 6, pertanyaan: "Warna bendera RI?", opsiA: "Merah Putih", opsiB: "Biru Putih", jawaban: "a" },
    { id: 7, pertanyaan: "Siapa penemu lampu?", opsiA: "Edison", opsiB: "Einstein", jawaban: "a" },
    { id: 8, pertanyaan: "Contoh hewan mamalia?", opsiA: "Ikan mas", opsiB: "Paus", jawaban: "b" },
    { id: 9, pertanyaan: "Planet merah?", opsiA: "Mars", opsiB: "Venus", jawaban: "a" },
    { id: 10, pertanyaan: "Berapa hasil dari 2 ditambah 2?", opsiA: "4", opsiB: "5", jawaban: "a" },
  ];

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("Menunggu...");

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  // Membaca soal otomatis saat index berubah
  useEffect(() => {
    const soal = daftarSoal[index];
    const textToRead = `Soal ${index + 1}: ${soal.pertanyaan}. Pilihan A, ${soal.opsiA}. Pilihan B, ${soal.opsiB}.`;
    speak(textToRead);
    setStatus("Silakan jawab dengan menyebut A atau B");
  }, [index]);

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser tidak mendukung pengenalan suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.onstart = () => setStatus("Mendengarkan...");

    recognition.onresult = (event: any) => {
      const hasilSuara = event.results[0][0].transcript.toLowerCase();
      const kunciJawaban = daftarSoal[index].jawaban;

      const isA = hasilSuara.includes("a") || hasilSuara.includes("ah");
      const isB = hasilSuara.includes("b") || hasilSuara.includes("be");

      let pilihanUser = "";
      if (isA) pilihanUser = "a";
      else if (isB) pilihanUser = "b";

      if (pilihanUser === kunciJawaban) {
        speak("Benar");
        setStatus("Benar! Melanjutkan...");
        setTimeout(() => {
          if (index < daftarSoal.length - 1) {
            setIndex(index + 1);
          } else {
            speak("Selamat, semua soal selesai");
            setStatus("Selesai! Kamu hebat.");
          }
        }, 1500);
      } else {
        speak("Salah, coba lagi");
        setStatus("Salah, coba lagi!");
      }
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-indigo-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-indigo-100">
        <h1 className="text-xl font-black mb-4 text-indigo-700">Soal {index + 1} dari 10</h1>
        <p className="text-xl mb-8 font-bold text-gray-800">{daftarSoal[index].pertanyaan}</p>

        <div className="space-y-4 mb-8 text-left">
          <div className="p-5 border-2 border-indigo-100 rounded-2xl bg-indigo-50 font-bold">A. {daftarSoal[index].opsiA}</div>
          <div className="p-5 border-2 border-indigo-100 rounded-2xl bg-indigo-50 font-bold">B. {daftarSoal[index].opsiB}</div>
        </div>

        <button
          onClick={startVoice}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-8 rounded-full shadow-xl hover:scale-105 transition-all"
        >
          <span className="text-4xl">🎙️</span>
        </button>

        <p className="mt-6 text-indigo-900 font-bold bg-indigo-100 py-3 px-6 rounded-full inline-block">{status}</p>

        <div className="mt-6">
          <button
            onClick={() => {
              const soal = daftarSoal[index];
              speak(`${soal.pertanyaan}. Pilihan A, ${soal.opsiA}. Pilihan B, ${soal.opsiB}.`);
            }}
            className="text-indigo-600 font-bold hover:underline"
          >
            Dengar ulang soal
          </button>
        </div>
      </div>
    </div>
  );
}