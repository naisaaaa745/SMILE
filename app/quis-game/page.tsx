'use client'; // Tambahkan ini di baris paling atas agar fitur interaktif (useState) bisa jalan

import { useState } from 'react';

// Kamu bisa memindahkan data ini ke file terpisah nanti jika sudah banyak soalnya
const quizData = [
  {
    question: "Apa yang harus dilakukan saat terjadi cuaca ekstrem (angin kencang)?",
    options: ["Bermain di luar", "Berlindung di dalam rumah", "Naik ke pohon"],
    correct: 1,
  },
];

export default function QuisPage() { // Nama fungsi disesuaikan dengan nama halaman
  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-2xl mx-auto p-8 bg-blue-900 text-white rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Quiz Detektif Cuaca</h2>
        <p className="mb-6">{quizData[currentQuestion].question}</p>
        
        <div className="grid gap-4">
          {quizData[currentQuestion].options.map((option, index) => (
            <button 
              key={index}
              className="p-4 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}