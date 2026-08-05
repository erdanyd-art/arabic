export interface DailyPhrase {
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

// Rotates deterministically by day-of-year — no AI, no network, just a
// fixed curated list so "Arabic of the Day" is instant and free.
const DAILY_PHRASES: DailyPhrase[] = [
  { word: "فاتورة", meaning: "Bon / tagihan", example: "هل أستطيع الحصول على الفاتورة؟", exampleTranslation: "Bolehkah saya minta bonnya?" },
  { word: "شكراً", meaning: "Terima kasih", example: "شكراً جزيلاً على مساعدتك.", exampleTranslation: "Terima kasih banyak atas bantuanmu." },
  { word: "من فضلك", meaning: "Tolong / silakan", example: "كوباً من الماء من فضلك.", exampleTranslation: "Segelas air, tolong." },
  { word: "طاولة", meaning: "Meja", example: "أريد طاولة بجانب النافذة.", exampleTranslation: "Saya mau meja dekat jendela." },
  { word: "حجز", meaning: "Reservasi", example: "لدي حجز باسم أحمد.", exampleTranslation: "Saya punya reservasi atas nama Ahmad." },
  { word: "رحلة", meaning: "Penerbangan / perjalanan", example: "متى تبدأ الرحلة؟", exampleTranslation: "Kapan penerbangannya dimulai?" },
  { word: "سعر", meaning: "Harga", example: "كم سعر هذا القميص؟", exampleTranslation: "Berapa harga baju ini?" },
  { word: "مناسب", meaning: "Cocok / pas", example: "هذا الوقت مناسب لي.", exampleTranslation: "Waktu ini cocok untukku." },
  { word: "بالتأكيد", meaning: "Tentu saja", example: "بالتأكيد، سأساعدك.", exampleTranslation: "Tentu saja, aku akan membantumu." },
  { word: "استراحة", meaning: "Istirahat", example: "أحتاج إلى استراحة قصيرة.", exampleTranslation: "Aku butuh istirahat sebentar." },
  { word: "موعد", meaning: "Janji temu", example: "لدي موعد الساعة الخامسة.", exampleTranslation: "Aku ada janji jam lima." },
  { word: "بالطبع", meaning: "Tentu / dengan senang hati", example: "بالطبع، تفضل بالجلوس.", exampleTranslation: "Tentu, silakan duduk." },
  { word: "قريب", meaning: "Dekat", example: "الفندق قريب من المطار.", exampleTranslation: "Hotelnya dekat dari bandara." },
  { word: "متأخر", meaning: "Terlambat", example: "آسف، أنا متأخر قليلاً.", exampleTranslation: "Maaf, aku sedikit terlambat." },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function getDailyPhrase(): DailyPhrase {
  const index = dayOfYear(new Date()) % DAILY_PHRASES.length;
  return DAILY_PHRASES[index];
}
