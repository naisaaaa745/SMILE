'use client';
import { useState } from 'react';

export default function QuizPage() {
  // Daftar 10 soal dengan opsi jawaban
  const daftarSoal = [
    { id: 1, pertanyaan: "Apa indikator utama cuaca ekstrem?", opsiA: "Langit cerah", opsiB: "Awan gelap", jawaban: "b" },
    { id: 2, pertanyaan: "Tindakan saat terjadi gempa?", opsiA: "Lari keluar", opsiB: "Berlindung di bawah meja", jawaban: "b" },
    { id: 3, pertanyaan: "Berapa titik didih air?", opsiA: "100 derajat", opsiB: "50 derajat", jawaban: "a" },
    { id: 4, pertanyaan: "Ibukota Indonesia?", opsiA: "Jakarta", opsiB: "Bandung", jawaban: "a" },
    { id: 5, pertanyaan: "Planet terbesar?", opsiA: "Bumi", opsiB: "Jupiter", jawaban: "b" },
    { id: 6, pertanyaan: "Warna bendera RI?", opsiA: "Merah Putih", opsiB: "Biru Putih", jawaban: "a" },
    { id: 7, pertanyaan: "Siapa penemu lampu?", opsiA: "Edison", opsiB: "Einstein", jawaban: "a" },
    { id: 8, pertanyaan: "Contoh hewan mamalia?", opsiA: "Ikan mas", opsiB: "Paus", jawaban: "b" },
    { id: 9, pertanyaan: "Planet yang dijuluki planet merah?", opsiA: "Mars", opsiB: "Venus", jawaban: "a" },
    { id: 10, pertanyaan: "Berapakah hasil dari 2+2?", opsiA: "4", opsiB: "5", jawaban: "a" },
  ];

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("Tekan tombol mikrofon untuk menjawab (Sebutkan A atau B)");

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser tidak mendukung fitur suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';

    recognition.onstart = () => setStatus("Mendengarkan...");
    recognition.onresult = (event: any) => {
      const hasilSuara = event.results[0][0].transcript.toLowerCase();
      const kunciJawaban = daftarSoal[index].jawaban;

      if (hasilSuara.includes(kunciJawaban)) {
        setStatus("Benar! Melanjutkan ke soal berikutnya...");
        setTimeout(() => {
          if (index < daftarSoal.length - 1) {
            setIndex(index + 1);
            setStatus("Tekan mikrofon untuk soal berikutnya");
          } else {
            setStatus("Selamat! Semua soal selesai.");
          }
        }, 1500);
      } else if (hasilSuara.includes("a") || hasilSuara.includes("b")) {
        setStatus("Jawaban salah, coba lagi!");
      } else {
        setStatus("Tidak terdengar, ulangi sebutkan A atau B");
      }
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <h1 className="text-xl font-bold mb-2 text-indigo-700">Soal {index + 1} dari 10</h1>
        <p className="text-lg mb-6 font-semibold text-gray-800">{daftarSoal[index].pertanyaan}</p>

        <div className="space-y-3 mb-8">
          <div className="p-4 border-2 border-indigo-100 rounded-xl bg-indigo-50 font-medium">A. {daftarSoal[index].opsiA}</div>
          <div className="p-4 border-2 border-indigo-100 rounded-xl bg-indigo-50 font-medium">B. {daftarSoal[index].opsiB}</div>
        </div>

        <button
          onClick={startVoice}
          className="bg-indigo-600 p-6 rounded-full text-4xl shadow-lg hover:scale-105 transition"
        >
          🎙️
        </button>
        <p className="mt-6 text-gray-600 font-bold italic">{status}</p>
      </div>
    </div>
  );
}