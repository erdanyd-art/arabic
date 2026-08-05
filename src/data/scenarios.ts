import type { Scenario, ScenarioCategory } from "@/types/conversation";

export const SCENARIOS: Scenario[] = [
  {
    id: "daily",
    title: "Percakapan Harian",
    description: "Obrolan santai tentang kegiatan sehari-hari",
    icon: "💬",
    difficulty: "pemula",
    estimatedMinutes: 5,
    objectives: [
      { id: "greet", label: "Menyapa dan memperkenalkan diri" },
      { id: "ask-wellbeing", label: "Menanyakan kabar lawan bicara" },
      { id: "share-activity", label: "Menceritakan kegiatan hari ini" },
      { id: "close-politely", label: "Menutup obrolan dengan sopan" },
    ],
  },
  {
    id: "restaurant",
    title: "Restoran",
    description: "Pesan makanan dan minuman ala pengunjung restoran",
    icon: "🍽️",
    difficulty: "pemula",
    estimatedMinutes: 5,
    objectives: [
      { id: "greet-waiter", label: "Menyapa pelayan" },
      { id: "ask-menu", label: "Meminta daftar menu" },
      { id: "order-food", label: "Memesan makanan atau minuman" },
      { id: "ask-bill", label: "Meminta bon/tagihan" },
    ],
  },
  {
    id: "shopping",
    title: "Berbelanja",
    description: "Tawar-menawar dan tanya harga di toko atau pasar",
    icon: "🛍️",
    difficulty: "pemula",
    estimatedMinutes: 6,
    objectives: [
      { id: "ask-price", label: "Menanyakan harga barang" },
      { id: "ask-size-color", label: "Menanyakan ukuran atau warna lain" },
      { id: "negotiate", label: "Menawar harga" },
      { id: "complete-purchase", label: "Menyelesaikan pembelian" },
    ],
  },
  {
    id: "airport",
    title: "Bandara",
    description: "Check-in, imigrasi, dan tanya arah di bandara",
    icon: "✈️",
    difficulty: "menengah",
    estimatedMinutes: 7,
    objectives: [
      { id: "show-documents", label: "Menunjukkan paspor/dokumen" },
      { id: "state-purpose", label: "Menjelaskan tujuan kedatangan" },
      { id: "ask-directions", label: "Menanyakan arah di bandara" },
      { id: "ask-duration", label: "Menjelaskan lama tinggal" },
    ],
  },
  {
    id: "hotel",
    title: "Hotel",
    description: "Check-in, minta bantuan, dan keluhan ke resepsionis",
    icon: "🏨",
    difficulty: "menengah",
    estimatedMinutes: 6,
    objectives: [
      { id: "check-in", label: "Melakukan check-in" },
      { id: "ask-facilities", label: "Menanyakan fasilitas hotel" },
      { id: "request-help", label: "Meminta bantuan resepsionis" },
      { id: "raise-complaint", label: "Menyampaikan keluhan" },
    ],
  },
  {
    id: "classroom",
    title: "Di Kelas",
    description: "Tanya jawab dengan guru dan diskusi pelajaran",
    icon: "🎓",
    difficulty: "pemula",
    estimatedMinutes: 5,
    objectives: [
      { id: "answer-question", label: "Menjawab pertanyaan guru" },
      { id: "ask-clarification", label: "Meminta penjelasan ulang" },
      { id: "give-opinion", label: "Menyampaikan pendapat singkat" },
      { id: "ask-permission", label: "Meminta izin bicara/keluar" },
    ],
  },
  {
    id: "interview",
    title: "Wawancara Kerja",
    description: "Simulasi tanya jawab wawancara kerja sederhana",
    icon: "💼",
    difficulty: "lanjutan",
    estimatedMinutes: 8,
    objectives: [
      { id: "introduce-self", label: "Memperkenalkan diri" },
      { id: "explain-education", label: "Menjelaskan latar belakang pendidikan" },
      { id: "describe-strengths", label: "Menceritakan kelebihan diri" },
      { id: "ask-question", label: "Mengajukan satu pertanyaan balik" },
    ],
  },
  {
    id: "friends",
    title: "Ketemu Teman",
    description: "Janjian dan ngobrol santai dengan teman",
    icon: "🤝",
    difficulty: "pemula",
    estimatedMinutes: 5,
    objectives: [
      { id: "make-plan", label: "Mengajak janjian bertemu" },
      { id: "agree-time-place", label: "Menyepakati waktu dan tempat" },
      { id: "small-talk", label: "Mengobrol santai" },
      { id: "say-goodbye", label: "Berpamitan" },
    ],
  },
];

/** Falls back to the first scenario rather than `undefined` — every id stored anywhere (notebook entries, history) was valid at save time, and SCENARIOS is small/static, so this only ever matters if a scenario is ever removed from the list. */
export function getScenario(id: ScenarioCategory): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}
