# Sprint 2 — Transform into a Real Arabic Speaking Coach

> Fokus: bukan sekadar chat AI, tapi produk belajar. Fitur inti sprint ini
> adalah **evaluasi per-kalimat** — setiap pesan pengguna dinilai
> (grammar, ungkapan natural, kosakata, kelancaran, saran), bukan cuma
> dibalas. Diverifikasi langsung ke Grok sungguhan, bukan simulasi.

## 1. Arsitektur AI (sesuai diagram di brief)

```
UI (ChatBubble, EvaluationCard, dst.)
  ↑
useConversation.ts        ← "Conversation Service": state pesan, retry,
                             download, TTS. Satu-satunya yang disentuh UI.
  ↓
tutorService.ts             ← "Tutor Service": rakit prompt dari
                               prompts/*, panggil provider, parse hasil
                               jadi { reply, evaluation }
  ↓
AiProvider (interface)        ← kontrak text-in/text-out generik
  ↓
grokProvider.ts / mockProvider.ts   ← implementasi nyata / offline
  ↓
server/index.js (proxy murni)  ← API key tidak pernah ke browser
  ↓
Grok API (xAI)
```

UI tidak pernah import provider atau menyusun prompt secara langsung —
semua lewat `useConversation` → `tutorService`.

## 2. Modul Prompt (tidak ada lagi giant string)

| File | Isi |
|---|---|
| `prompts/persona.ts` | Identitas tutor ("Lisan") — kepribadian, larangan menyebut diri "AI" |
| `prompts/feedback.ts` | Prinsip *nada* memberi feedback (suportif, jujur, selalu mendorong lanjut bicara) |
| `prompts/scenario.ts` | Fungsi `buildScenarioPrompt(scenario)` — konteks & peran situasional |
| `prompts/evaluation.ts` | Skema JSON evaluasi persis + aturan pengisiannya |
| `prompts/system.ts` | Satu-satunya tempat yang menggabungkan semua modul di atas + kontrak format balasan (`buildSystemPrompt(scenario)`) |

## 3. Fitur Utama: Evaluasi Per-Kalimat

Setiap kali pengguna kirim pesan, satu panggilan API mengembalikan **dua
hal sekaligus** (bukan 2x API call terpisah, demi hemat biaya & latensi):
balasan tutor yang natural, **dan** evaluasi kalimat yang baru diucapkan
pengguna — dipisah dengan marker `===EVAL===` yang di-parse
`tutorService.ts`.

`EvaluationCard.tsx` — collapsed by default (toggle "Lihat evaluasi",
bukan langsung terbuka penuh — biar tidak mengacaukan alur baca chat),
berisi:
- **Tata bahasa** — jujur, bukan selalu "benar" (diverifikasi: kalimat
  yang sengaja saya buat salah beneran ditandai `correct: false` dengan
  penjelasan spesifik)
- **Ungkapan natural** — versi yang lebih natural, hanya muncul kalau
  memang berbeda
- **Kosakata** — diambil dari kata-kata yang benar-benar ada di kalimat
  pengguna
- **Kelancaran** — komentar singkat
- **Saran berikutnya** — dorongan konkret untuk lanjut bicara

**Extensible by design**: menambah evaluator baru (pelafalan, estimasi
CEFR, kepercayaan diri bicara) di masa depan = tambah satu field di
`Evaluation` type + satu `<Section>` baru di `EvaluationCard.tsx`. Tidak
ada bagian lain dari pipeline yang perlu diubah.

## 4. Redesign Visual

Prinsip brief: hindari gradient berlebihan, glassmorphism, kartu di
mana-mana, badge mencolok — hierarki dari tipografi & whitespace, bukan
dekorasi.

| Sebelum | Sesudah |
|---|---|
| Hero dengan badge ikon gradient besar | Judul teks polos + tagline, tanpa gradient |
| Grid skenario 2 kolom dengan badge bintang "Mulai di sini" | List vertikal rapi, difficulty & estimasi waktu sebagai teks kecil di kanan (bukan badge warna-warni) |
| Contoh frasa dibungkus `<Card>` bershadow | Baris sederhana dengan divider tipis |
| Header sesi cuma nama skenario | Header sekarang tampilkan **skenario · difficulty · estimasi waktu** sekaligus (sesuai hierarki informasi di brief) |

Scope redesign **sengaja dibatasi ke layar Bicara AI saja** — bukan
seluruh aplikasi, karena app ini punya mode lain (Kosakata, Kalimat,
Quran, dll) yang berbagi satu design system dari Sprint 1; merombak token
global akan berisiko merusak konsistensi di luar cakupan brief ini.

## 5. Verifikasi

- `tsc -b`, `oxlint`, `vite build` — semua bersih.
- **Diuji ke Grok API sungguhan** (bukan mock): kalimat sengaja dibuat
  dengan kesalahan tata bahasa ("انا اريد اكل بيتزا من فضلك كثير") →
  evaluasi yang kembali benar-benar mendeteksi kesalahannya secara
  spesifik dan memberi contoh perbaikan yang tepat.
- End-to-end lewat browser: pilih skenario → header tampilkan
  difficulty+durasi → kirim pesan → toggle "Lihat evaluasi" muncul di
  bawah pesan user → expand menampilkan 5 bagian evaluasi lengkap →
  balasan tutor tetap muncul & dibacakan seperti biasa. Diuji juga di
  dark mode. Nol error console.

## 6. Rekomendasi Lanjutan

1. **Pelafalan sungguhan** — saat ini evaluasi berbasis teks (dari speech
   recognition browser). Skor pelafalan asli butuh kirim audio mentah ke
   model multimodal, bukan transkrip.
2. **Riwayat evaluasi lintas sesi** — `useAppStore` dari Sprint 1 sudah
   ada infra riwayat; bisa disambungkan untuk lihat tren grammar/fluency
   dari waktu ke waktu (tanpa harus jadi XP/gamifikasi).
3. **CEFR & speaking confidence** — field baru di `Evaluation` type,
   tinggal tambah section di `EvaluationCard` — arsitekturnya sudah siap.
4. **Uji `mockProvider.ts`** — sekarang jadi fallback sekunder (bukan
   default lagi); cukup untuk offline dev, tapi tidak sekaya versi mock
   sebelumnya karena sengaja disederhanakan mengikuti kontrak `AiProvider`
   yang generik (tidak tahu skenario spesifik).
