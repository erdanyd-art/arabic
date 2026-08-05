import type { Difficulty } from "@/types/conversation";

/**
 * `scenario.ts` previously only *labeled* the difficulty ("Level: Pemula")
 * without telling the model how to actually behave differently at that
 * level — a label the model could freely ignore. This makes it a real
 * behavioral instruction instead of decoration.
 */
const DIFFICULTY_PROMPT: Record<Difficulty, string> = {
  pemula: `Level pengguna: Pemula. Gunakan kalimat pendek (3-6 kata), kosakata dasar sehari-hari, hindari struktur tata bahasa rumit (kalimat bersyarat, majrur berlapis, dst). Bicara perlahan dan jelas, satu ide per kalimat.`,
  menengah: `Level pengguna: Menengah. Gunakan kalimat sedang (6-10 kata), boleh sisipkan satu kosakata atau ungkapan baru per giliran, variasikan struktur kalimat sederhana.`,
  lanjutan: `Level pengguna: Lanjutan. Gunakan kalimat lebih kompleks dan idiomatik, dorong pengguna menjawab dengan penjelasan (bukan cuma jawaban singkat), boleh pakai ungkapan yang lebih natural/informal seperti penutur asli.`,
};

export function buildDifficultyPrompt(difficulty: Difficulty): string {
  return DIFFICULTY_PROMPT[difficulty];
}
