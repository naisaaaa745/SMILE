import os
import time
import uuid
import logging
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from gtts import gTTS

# Konfigurasi Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Konfigurasi CORS agar Next.js di localhost:3000 dapat mengakses API
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Tentukan direktori penyimpanan file audio statis
AUDIO_DIR = os.path.join(app.root_path, 'static', 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

# URL dasar untuk file audio statis
BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")

# Soal Kuis Dummy (Kunci jawaban disimpan di backend untuk pencocokan)
QUIZ_QUESTIONS = [
    {
        "id": "1",
        "question": "Apa salah satu dampak utama dari perubahan iklim global?",
        "options": [
            {"key": "A", "text": "Penurunan permukaan air laut secara global"},
            {"key": "B", "text": "Meningkatnya frekuensi cuaca ekstrem seperti badai dan kekeringan"},
            {"key": "C", "text": "Peningkatan ketebalan lapisan es secara permanen di kutub"},
            {"key": "D", "text": "Kestabilan iklim di seluruh benua bumi"}
        ],
        "correct_answer": "B"
    },
    {
        "id": "2",
        "question": "Gas apa yang paling banyak dihasilkan dari pembakaran bahan bakar fosil dan menjadi penyebab utama efek rumah kaca?",
        "options": [
            {"key": "A", "text": "Oksigen (O2)"},
            {"key": "B", "text": "Nitrogen (N2)"},
            {"key": "C", "text": "Karbon Dioksida (CO2)"},
            {"key": "D", "text": "Helium (He)"
            }
        ],
        "correct_answer": "C"
    },
    {
        "id": "3",
        "question": "Aktivitas apa yang dapat membantu mengurangi kadar karbon dioksida di atmosfer secara alami?",
        "options": [
            {"key": "A", "text": "Penebangan hutan secara liar (deforestasi)"},
            {"key": "B", "text": "Pembangunan pabrik industri baru tanpa filter udara"},
            {"key": "C", "text": "Reboisasi atau penanaman hutan kembali"},
            {"key": "D", "text": "Penggunaan kendaraan bermotor pribadi secara berlebihan"}
        ],
        "correct_answer": "C"
    }
]

# Fungsi Pembersih File Audio Lama (Mencegah penumpukan file TTS sementara)
def cleanup_old_audio_files(directory, max_age_seconds=600):
    """Menghapus file TTS sementara yang berumur lebih dari `max_age_seconds` (default 10 menit)."""
    try:
        now = time.time()
        for filename in os.listdir(directory):
            if filename.startswith("tts_") and filename.endswith(".mp3"):
                filepath = os.path.join(directory, filename)
                if os.path.isfile(filepath):
                    file_modified_time = os.path.getmtime(filepath)
                    if (now - file_modified_time) > max_age_seconds:
                        os.remove(filepath)
                        logger.info(f"Pembersihan otomatis: Menghapus file audio lama {filename}")
    except Exception as e:
        logger.error(f"Gagal melakukan pembersihan file audio: {str(e)}")

# Route Root / Health Check
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "app": "SMILE Backend API",
        "version": "1.0.0"
    }), 200

# ==========================================
# 1. API untuk Halaman 'Lesson'
# ==========================================
@app.route("/api/lesson", methods=["GET"])
def get_lesson():
    try:
        title = "Perubahan Iklim dan Dampaknya"
        teks_materi = (
            "Perubahan iklim adalah perubahan signifikan pada iklim, suhu udara, dan curah hujan "
            "dalam jangka waktu yang panjang. Hal ini disebabkan oleh aktivitas manusia seperti pembakaran "
            "bahan bakar fosil dan penebangan hutan secara liar yang meningkatkan konsentrasi gas rumah "
            "kaca di atmosfer bumi. Dampaknya meliputi pencairan es di kutub, kenaikan permukaan laut, "
            "serta cuaca ekstrem yang membahayakan ketahanan pangan global."
        )
        
        # Nama file audio statis untuk materi pelajaran
        filename = "lesson_climate_change.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        
        # Buat audio materi jika belum ada
        if not os.path.exists(filepath):
            logger.info("Menghasilkan audio materi baru untuk halaman Lesson...")
            tts = gTTS(text=teks_materi, lang='id')
            tts.save(filepath)
            
        audio_url = f"{BASE_URL}/static/audio/{filename}"
        
        return jsonify({
            "id": 1,
            "title": title,
            "teks_materi": teks_materi,
            "audio_url": audio_url
        }), 200
        
    except Exception as e:
        logger.error(f"Error pada GET /api/lesson: {str(e)}")
        return jsonify({
            "error": "Gagal mengambil data materi lesson.",
            "details": str(e)
        }), 500

# ==========================================
# 2. API untuk Halaman 'Talk Space'
# ==========================================
@app.route("/api/talkspace/tts", methods=["POST"])
def text_to_speech():
    try:
        # Lakukan pembersihan file lama secara berkala
        cleanup_old_audio_files(AUDIO_DIR)
        
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Payload tidak valid. Parameter 'text' wajib disertakan."}), 400
            
        text = data['text'].strip()
        if not text:
            return jsonify({"error": "Teks tidak boleh kosong."}), 400
            
        # Buat nama file unik menggunakan UUID
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        
        # Konversi teks ke suara menggunakan gTTS (Bahasa Indonesia)
        logger.info(f"Mengubah teks menjadi suara untuk Talk Space TTS: '{text[:30]}...'")
        tts = gTTS(text=text, lang='id')
        tts.save(filepath)
        
        audio_url = f"{BASE_URL}/static/audio/{filename}"
        
        return jsonify({
            "status": "success",
            "text": text,
            "audio_url": audio_url
        }), 200
        
    except Exception as e:
        logger.error(f"Error pada POST /api/talkspace/tts: {str(e)}")
        return jsonify({
            "error": "Gagal memproses Text-to-Speech.",
            "details": str(e)
        }), 500

@app.route("/api/talkspace/stt", methods=["POST"])
def speech_to_text_mock():
    try:
        # Mendukung JSON maupun FormData untuk simulasi fleksibel
        text_input = ""
        is_audio = False
        
        if request.is_json:
            data = request.get_json()
            text_input = data.get("text", "").strip() if data else ""
        elif request.files:
            # Simulasi file audio diunggah
            audio_file = request.files.get("audio")
            if audio_file:
                is_audio = True
                text_input = "Simulasi suara dari rekaman audio yang berhasil diunggah"
        else:
            text_input = request.form.get("text", "").strip()

        if not text_input and not is_audio:
            return jsonify({"error": "Harap kirim parameter 'text' atau file audio."}), 400

        # Logika Mock-Up Balasan Cerdas berdasarkan Input Pengguna
        text_input_lower = text_input.lower()
        if "halo" in text_input_lower or "hai" in text_input_lower:
            reply = "Halo! Senang bisa berbicara denganmu di Talk Space. Bagaimana belajarmu hari ini?"
        elif "materi" in text_input_lower or "lesson" in text_input_lower:
            reply = "Di menu Lesson, kamu bisa belajar tentang Perubahan Iklim dengan audio pemandu yang ramah."
        elif "kuis" in text_input_lower or "game" in text_input_lower:
            reply = "Kamu bisa menguji kemampuanmu di Quiz Game! Coba dan capai skor tertinggimu ya!"
        elif "terima kasih" in text_input_lower:
            reply = "Sama-sama! Selalu semangat belajar dan mengeksplorasi hal baru."
        else:
            reply = "Pesan kamu diterima dengan baik! Mari kita terus berlatih berbicara dan berekspresi secara mandiri."

        return jsonify({
            "status": "success",
            "user_input": text_input,
            "reply": reply,
            "simulated_mode": "Speech-to-Text Mockup",
            "audio_received": is_audio
        }), 200
        
    except Exception as e:
        logger.error(f"Error pada POST /api/talkspace/stt: {str(e)}")
        return jsonify({
            "error": "Gagal memproses simulasi Speech-to-Text.",
            "details": str(e)
        }), 500

# ==========================================
# 3. API untuk Halaman 'Quiz Game'
# ==========================================
@app.route("/api/quiz", methods=["GET"])
def get_quiz():
    try:
        # Mengembalikan soal tanpa menyertakan kunci jawaban demi keamanan/integritas kuis
        quiz_data = []
        for question in QUIZ_QUESTIONS:
            quiz_data.append({
                "id": question["id"],
                "question": question["question"],
                "options": question["options"]
            })
        return jsonify(quiz_data), 200
    except Exception as e:
        logger.error(f"Error pada GET /api/quiz: {str(e)}")
        return jsonify({
            "error": "Gagal mengambil daftar soal kuis.",
            "details": str(e)
        }), 500

@app.route("/api/quiz/submit", methods=["POST"])
def submit_quiz():
    try:
        data = request.get_json()
        if not data or 'answers' not in data:
            return jsonify({"error": "Format data kuis tidak valid. Wajib menyertakan parameter 'answers'."}), 400
            
        user_answers = data['answers']  # format: {"1": "B", "2": "C"}
        
        correct_count = 0
        total_questions = len(QUIZ_QUESTIONS)
        details = {}
        
        for q in QUIZ_QUESTIONS:
            q_id = q["id"]
            correct_ans = q["correct_answer"]
            user_ans = user_answers.get(q_id, "").strip().upper()
            
            is_correct = (user_ans == correct_ans)
            if is_correct:
                correct_count += 1
                
            details[q_id] = {
                "correct": is_correct,
                "user_answer": user_ans,
                "correct_answer": correct_ans
            }
            
        score = round((correct_count / total_questions) * 100, 2)
        
        # Berikan feedback kata-kata motivasi
        if score == 100:
            message = "Luar biasa! Semua jawabanmu benar. Kamu memahami materi perubahan iklim dengan sangat baik!"
        elif score >= 50:
            message = "Kerja bagus! Kamu berhasil menjawab sebagian besar soal dengan benar. Pertahankan prestasimu!"
        else:
            message = "Belajar lagi ya! Coba baca kembali materi pada halaman Lesson dan ulangi kuisnya."

        return jsonify({
            "status": "success",
            "score": score,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "details": details,
            "feedback": message
        }), 200
        
    except Exception as e:
        logger.error(f"Error pada POST /api/quiz/submit: {str(e)}")
        return jsonify({
            "error": "Gagal memproses hasil kuis.",
            "details": str(e)
        }), 500

# ==========================================
# 4. API untuk Fitur Sign In (Dummy)
# ==========================================
@app.route("/api/signin", methods=["POST"])
@cross_origin()
def sign_in():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"status": "error", "message": "Username dan password wajib diisi."}), 400
            
        username = data['username'].strip()
        password = data['password'].strip()
        
        # Pengecekan hardcoded sesuai spesifikasi
        if username == "siswa" and password == "SMILE123":
            return jsonify({"status": "success", "message": "Login berhasil!"}), 200
        else:
            return jsonify({"status": "error", "message": "Username atau password salah."}), 401
            
    except Exception as e:
        logger.error(f"Error pada POST /api/signin: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Terjadi kesalahan internal server.",
            "details": str(e)
        }), 500

# Route statis kustom untuk melayani audio jika static_url_path Flask ada kendala
@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_DIR, filename)

# Menjalankan Flask Server
if __name__ == "__main__":
    logger.info("Menjalankan backend server SMILE...")
    # Menjalankan di port 5000, diizinkan dari semua network host (0.0.0.0) agar mudah diakses
    app.run(host="0.0.0.0", port=5000, debug=True)
