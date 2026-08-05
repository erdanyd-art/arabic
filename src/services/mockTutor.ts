import type { ScenarioCategory, SendMessageInput, TutorProvider, TutorReply } from "@/types/conversation";

// Response bank per scenario, ordered as a small narrative arc (opening →
// middle → closing) rather than a random bag of lines. This is still NOT
// context-aware of what the user actually typed — it's a mock standing in
// for a real model — but presenting lines *in sequence* means consecutive
// turns read as a conversation moving forward instead of jumping around
// (e.g. asking "what would you like to order?" right after the order was
// already placed and paid for).
const RESPONSE_BANK: Record<ScenarioCategory, TutorReply[]> = {
  daily: [
    { text: "هل كان يومك جيدًا؟", translation: "Apakah harimu menyenangkan?" },
    { text: "أخبرني المزيد عن يومك.", translation: "Ceritakan lebih banyak tentang harimu." },
    { text: "هذا مثير للاهتمام حقًا.", translation: "Itu sangat menarik." },
    { text: "ما رأيك في ذلك؟", translation: "Apa pendapatmu tentang itu?" },
    { text: "هذا رائع! ماذا فعلت بعد ذلك؟", translation: "Itu bagus! Apa yang kamu lakukan setelah itu?" },
  ],
  restaurant: [
    { text: "أهلًا بك! هل تحتاج إلى قائمة الطعام؟", translation: "Selamat datang! Perlu menu makanan?" },
    { text: "ماذا تريد أن تطلب اليوم؟", translation: "Apa yang ingin kamu pesan hari ini?" },
    { text: "هل تريد شيئًا للشرب أيضًا؟", translation: "Mau minum apa juga?" },
    { text: "حسنًا، طلبك سيصل بعد قليل.", translation: "Baik, pesananmu akan datang sebentar lagi." },
    { text: "تفضل، أتمنى أن يعجبك الطعام.", translation: "Silakan, semoga makanannya enak." },
  ],
  shopping: [
    { text: "أهلًا، أي شيء تبحث عنه اليوم؟", translation: "Halo, kamu cari apa hari ini?" },
    { text: "أي لون تفضل؟", translation: "Warna apa yang kamu suka?" },
    { text: "هل تريد تجربته أولاً؟", translation: "Mau dicoba dulu?" },
    { text: "هل يوجد خصم لهذا المنتج اليوم؟", translation: "Ada diskon untuk barang ini hari ini?" },
    { text: "تفضل، هذا سعر مناسب جدًا.", translation: "Silakan, ini harga yang cukup pas." },
  ],
  airport: [
    { text: "أهلًا بك، هل معك جواز سفرك؟", translation: "Selamat datang, apakah kamu bawa paspor?" },
    { text: "كم حقيبة معك؟", translation: "Berapa koper yang kamu bawa?" },
    { text: "بوابتك هي B12، من هذا الاتجاه من فضلك.", translation: "Gerbangmu B12, lewat sini ya." },
    { text: "للأسف، الرحلة ستتأخر قليلاً بسبب الطقس.", translation: "Maaf, penerbangannya akan sedikit terlambat karena cuaca." },
    { text: "استمتع برحلتك!", translation: "Selamat menikmati perjalananmu!" },
  ],
  hotel: [
    { text: "أهلًا بك، هل لديك حجز؟", translation: "Selamat datang, apakah kamu punya reservasi?" },
    { text: "حسنًا، غرفتك في الطابق الثالث.", translation: "Baik, kamarmu di lantai tiga." },
    { text: "هل تحتاج إلى مساعدة مع حقائبك؟", translation: "Perlu bantuan dengan kopermu?" },
    { text: "الإفطار من الساعة السابعة صباحًا.", translation: "Sarapan mulai jam tujuh pagi." },
    { text: "أتمنى لك إقامة سعيدة.", translation: "Semoga menginap dengan nyaman." },
  ],
  classroom: [
    { text: "افتح كتابك من فضلك.", translation: "Buka bukumu, tolong." },
    { text: "هل فهمت الدرس؟", translation: "Apakah kamu paham pelajarannya?" },
    { text: "هل عندك سؤال؟", translation: "Ada pertanyaan?" },
    { text: "أحسنت، إجابة ممتازة!", translation: "Bagus, jawaban yang sangat baik!" },
    { text: "لنراجع الدرس معًا.", translation: "Ayo kita ulas pelajarannya bersama." },
  ],
  interview: [
    { text: "حدثني عن نفسك.", translation: "Ceritakan tentang dirimu." },
    { text: "لماذا تريد هذه الوظيفة؟", translation: "Kenapa kamu mau pekerjaan ini?" },
    { text: "ما هي نقاط قوتك؟", translation: "Apa kelebihanmu?" },
    { text: "متى يمكنك أن تبدأ العمل؟", translation: "Kapan kamu bisa mulai bekerja?" },
    { text: "شكرًا لوقتك، سنتواصل معك قريبًا.", translation: "Terima kasih atas waktumu, kami akan menghubungimu segera." },
  ],
  friends: [
    { text: "منذ متى لم نلتقِ!", translation: "Sudah lama kita tidak bertemu!" },
    { text: "اشتقت إليك كثيرًا.", translation: "Aku sangat merindukanmu." },
    { text: "أين نذهب اليوم؟", translation: "Kita mau pergi ke mana hari ini?" },
    { text: "هل تريد أن نشرب قهوة معًا؟", translation: "Mau minum kopi bareng?" },
    { text: "لنتقابل في نفس المكان غدًا.", translation: "Ayo ketemu di tempat yang sama besok." },
  ],
};

// ---------------------------------------------------------------------------
// Reactive layer: without a real language model, the mock can't truly
// understand arbitrary input — but a handful of very common patterns
// (thanks, price questions, "why/how/when") are worth recognizing so the
// tutor doesn't visibly ignore an obvious cue (e.g. replying "enjoy your
// trip!" right after being asked "why"). Anything NOT matched here falls
// through to the next scripted line — this is a mock, not real NLU, and
// won't catch everything (Sprint 3 / real AI is the actual fix for that).
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function hasWord(words: string[], target: string): boolean {
  return words.some((w) => w.replace(/[؟?.,!]/g, "") === target);
}

function hasSubstring(text: string, needles: string[]): boolean {
  return needles.some((n) => text.includes(n));
}

const THANKS_REPLIES: TutorReply[] = [
  { text: "عفوًا! بالتوفيق.", translation: "Sama-sama! Semoga lancar." },
  { text: "لا شكر على واجب.", translation: "Tidak perlu berterima kasih." },
  { text: "على الرحب والسعة.", translation: "Dengan senang hati." },
];

const PRICE_REPLIES: Partial<Record<ScenarioCategory, TutorReply>> = {
  restaurant: { text: "السعر يعتمد على طلبك، لكنه معقول جدًا.", translation: "Harganya tergantung pesananmu, tapi cukup terjangkau." },
  shopping: { text: "هذا السعر مناسب جدًا مقارنة بالجودة.", translation: "Harga ini cukup pas dibanding kualitasnya." },
};

// Shared fallback for "why / how / when" — generic enough to fit any
// scenario, and far less jarring than a random unrelated scripted line.
const CLARIFYING_REPLIES: TutorReply[] = [
  { text: "سؤال جيد، دعني أوضح لك أكثر.", translation: "Pertanyaan bagus, biar saya jelaskan lebih lanjut." },
  { text: "هذا يعتمد على الوضع، لكن لا تقلق.", translation: "Itu tergantung situasinya, tapi jangan khawatir." },
  { text: "سأخبرك بالتفصيل بعد قليل.", translation: "Saya akan kasih tahu detailnya sebentar lagi." },
];

let thanksCursor = 0;
let clarifyCursor = 0;

function matchReactive(scenarioId: ScenarioCategory, message: string): TutorReply | null {
  const text = message.trim();
  const words = tokenize(text);

  if (hasSubstring(text, ["شكر"])) {
    const reply = THANKS_REPLIES[thanksCursor % THANKS_REPLIES.length];
    thanksCursor += 1;
    return reply;
  }

  const priceReply = PRICE_REPLIES[scenarioId];
  if (priceReply && hasSubstring(text, ["كم سعر", "كم ثمن", "بكم", "سعرها", "سعره"])) {
    return priceReply;
  }

  if (
    hasSubstring(text, ["لماذا", "ليش", "كيف", "متى"]) ||
    hasWord(words, "لماذا") ||
    hasWord(words, "كيف") ||
    hasWord(words, "متى")
  ) {
    const reply = CLARIFYING_REPLIES[clarifyCursor % CLARIFYING_REPLIES.length];
    clarifyCursor += 1;
    return reply;
  }

  return null;
}

const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 1500;

/**
 * Stands in for a real AI tutor until Gemini access is restored. Implements
 * the same `TutorProvider` interface a future `GeminiTutorProvider` will —
 * callers (see hooks/useConversation.ts) never branch on which one they got.
 */
export class MockTutorProvider implements TutorProvider {
  private nextIndexByScenario = new Map<ScenarioCategory, number>();

  async sendMessage({ scenario, message }: SendMessageInput): Promise<TutorReply> {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const reactive = matchReactive(scenario.id, message);
    if (reactive) return reactive;

    const bank = RESPONSE_BANK[scenario.id];
    const nextIndex = this.nextIndexByScenario.get(scenario.id) ?? 0;
    this.nextIndexByScenario.set(scenario.id, (nextIndex + 1) % bank.length);
    return bank[nextIndex];
  }
}

export const mockTutorProvider = new MockTutorProvider();
