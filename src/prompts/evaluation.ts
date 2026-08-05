/**
 * Defines *what* gets evaluated on every learner message, and the exact
 * JSON shape the model must return for it (parsed by
 * services/tutorService.ts into the `Evaluation` type).
 *
 * Extensibility: adding a new evaluator (pronunciation, CEFR estimate,
 * speaking confidence, …) later means adding one more field to this
 * schema description + the `Evaluation` type + one more section in
 * `EvaluationCard.tsx` — nothing else in the pipeline changes.
 */
export const EVALUATION_SCHEMA_PROMPT = `Selain membalas secara natural, evaluasi SETIAP kalimat yang baru saja diucapkan pengguna (bukan riwayat sebelumnya). Sertakan objek "evaluation" dengan struktur PERSIS seperti ini:

{
  "grammar": { "correct": boolean, "note": "komentar singkat 1 kalimat" },
  "natural": { "rewrite": "versi lebih natural jika ada, kosongkan jika kalimatnya sudah natural", "note": "penjelasan singkat" },
  "vocabulary": [{ "word": "kata Arab", "meaning": "arti Indonesia" }, ...maksimal 3 kata kunci dari kalimat pengguna],
  "fluency": { "note": "komentar singkat soal kelancaran/kompleksitas kalimat" },
  "suggestion": "satu saran konkret untuk kalimat berikutnya, boleh berupa contoh kalimat",
  "goalsAddressed": ["id tujuan yang tercapai lewat pertukaran ini, jika ada"]
}

Aturan evaluasi:
- "grammar.correct" harus jujur — jangan selalu true.
- "natural.rewrite" HANYA diisi kalau ada perbedaan nyata dari yang diucapkan; kosongkan (string kosong) kalau sudah natural.
- "vocabulary" ambil dari kata-kata yang benar-benar ada di kalimat pengguna, bukan kosakata baru yang tidak diucapkan.
- Semua teks evaluasi ditulis dalam Bahasa Indonesia (bukan Arab), supaya mudah dipahami pemula.
- Tulis setiap "note" dengan kata-katamu sendiri untuk kalimat ini secara spesifik — jangan pakai kalimat template generik yang bisa dipakai untuk kalimat manapun (mis. hindari selalu menulis persis "Tata bahasa sudah benar" atau "Kerja bagus!"). Kalau memang tidak ada masalah, katakan itu secara ringkas dan spesifik ke apa yang diucapkan pengguna.
- "suggestion" harus konkret dan mendorong pengguna lanjut ke langkah berikutnya dalam skenario ini, bukan saran umum yang lepas dari konteks percakapan.
- "goalsAddressed" HANYA diisi dengan id tujuan (lihat daftar tujuan belajar di konteks skenario) yang benar-benar tercapai lewat pertukaran INI SAJA (bukan kumulatif dari giliran sebelumnya) — array kosong kalau tidak ada.`;
