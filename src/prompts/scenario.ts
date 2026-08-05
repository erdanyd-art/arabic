import type { Scenario, ScenarioCategory } from "@/types/conversation";
import { buildDifficultyPrompt } from "./difficulty";

/**
 * Previously this was a vague "play whatever partner fits, e.g. waiter,
 * officer, friend..." — the model had to guess a role every time, which is
 * exactly what let it slip out of character mid-conversation. This maps
 * each scenario to one hard, specific role so it never has to guess.
 */
const ROLE_BY_CATEGORY: Record<ScenarioCategory, { role: string; behavior: string }> = {
  restaurant: {
    role: "seorang pelayan restoran",
    behavior: "proaktif menawarkan menu, rekomendasi, atau menanyakan pesanan selanjutnya",
  },
  airport: {
    role: "seorang petugas imigrasi/bandara",
    behavior: "bertanya hal-hal prosedural (paspor, tujuan, lama tinggal) secara sopan tapi tegas",
  },
  shopping: {
    role: "seorang pemilik/penjaga toko",
    behavior: "menawarkan pilihan barang, harga, atau ukuran dengan ramah",
  },
  interview: {
    role: "seorang pewawancara kerja",
    behavior: "menggali jawaban pengguna lebih dalam dengan pertanyaan lanjutan yang profesional",
  },
  hotel: {
    role: "seorang resepsionis hotel",
    behavior: "membantu proses check-in/permintaan tamu dan menawarkan bantuan lain",
  },
  classroom: {
    role: "seorang guru",
    behavior: "aktif bertanya, menguji pemahaman, dan membimbing pengguna selangkah demi selangkah",
  },
  daily: {
    role: "orang yang ditemui pengguna dalam situasi sehari-hari (tetangga, orang di jalan, dst.)",
    behavior: "mengobrol santai dan menunjukkan rasa ingin tahu yang wajar",
  },
  friends: {
    role: "seorang teman dekat pengguna",
    behavior: "antusias, santai, dan aktif bertanya balik seperti obrolan pertemanan sungguhan",
  },
};

function buildObjectivesPrompt(scenario: Scenario): string {
  if (scenario.objectives.length === 0) return "";
  const list = scenario.objectives.map((o) => `- [id: ${o.id}] ${o.label}`).join("\n");
  return `\n\nTujuan belajar pengguna di sesi ini (untuk field "goalsAddressed" pada evaluation, lihat skema evaluasi):\n${list}`;
}

/** Turns a Scenario into the situational context injected into the system prompt for the current session. */
export function buildScenarioPrompt(scenario: Scenario): string {
  const { role, behavior } = ROLE_BY_CATEGORY[scenario.id];
  return `Konteks latihan saat ini: "${scenario.title}" — ${scenario.description}
Perankan ${role}. Sikapmu dalam peran ini: ${behavior}.
Jangan pernah keluar dari peran ini sepanjang percakapan, walau pengguna mengajak topik lain — bawa kembali ke konteks skenario secara wajar.

${buildDifficultyPrompt(scenario.difficulty)}${buildObjectivesPrompt(scenario)}`;
}
