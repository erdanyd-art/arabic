# Sprint 2 — Complete the Speaking Experience (No AI)

> Membangun ulang "Latihan Bicara AI" agar berjalan **100% di frontend**,
> tanpa dependency ke backend/Gemini sama sekali, lewat abstraksi
> `TutorProvider` yang membuat provider AI sungguhan nanti tinggal
> pasang tanpa menyentuh UI.

## 1. Struktur Folder Baru

```
src/
├─ types/
│  └─ conversation.ts        ChatMessage, Scenario, TutorProvider, TutorReply
├─ services/                  logic murni, tanpa React
│  ├─ speechRecognition.ts     wrapper Web Speech API (start/stop/abort)
│  └─ mockTutor.ts              MockTutorProvider — implementasi TutorProvider
├─ hooks/
│  ├─ useSpeechRecognition.ts   state rekam: idle/listening/processing/finished
│  └─ useConversation.ts         orkestrasi percakapan via TutorProvider
├─ data/
│  └─ scenarios.ts               8 skenario (icon, judul, deskripsi)
├─ components/domain/ai-speaking/
│  ├─ MicButton.tsx               4-state + animasi Framer Motion
│  ├─ AudioWaveform.tsx           (dipakai ulang dari sebelumnya)
│  ├─ TranscriptEditor.tsx        BARU — edit/copy/clear/send manual
│  ├─ ChatBubble.tsx               + timestamp, + retry inline
│  ├─ TypingIndicator.tsx         (dipakai ulang)
│  ├─ SpeakingBar.tsx              (dipakai ulang)
│  ├─ SessionControlsBar.tsx      (dipakai ulang)
│  ├─ EmptyStateCard.tsx           redesign — welcome + contoh frasa + 8 skenario
│  └─ ErrorBanner.tsx              (dipakai ulang)
└─ routes/
   └─ AiSpeakingSession.tsx        dirakit ulang di atas hook baru
```

**Dihapus** (tergantikan, tidak ada lagi pemanggil selain dirinya sendiri —
dicek dengan grep sebelum dihapus): `hooks/useVoiceRecorder.ts`,
`hooks/useAiSpeakingChat.ts`, `lib/aiChat.ts`.

**Tidak disentuh**: `server/` (Express proxy Gemini) dibiarkan apa adanya,
dormant — bukan dihapus, karena persis itu yang akan dipakai
`GeminiTutorProvider` nanti. Sprint ini murni tidak memanggilnya.

## 2. Hooks Baru

| Hook | Isi |
|---|---|
| `useSpeechRecognition()` | State machine rekam (`idle → listening → processing → finished`, plus `error`), timer, 28-bar level audio via `AnalyserNode` untuk waveform, transkrip live, `start()/stop()/restart()/resetError()`, deteksi dukungan browser |
| `useConversation(scenario, provider = mockTutorProvider)` | Kirim pesan lewat `TutorProvider`, kelola daftar pesan, retry pesan gagal, hapus percakapan, unduh transkrip (.md/.txt), putar/hentikan/putar-ulang TTS balasan tutor (dengan guard anti double-playback) |

## 3. Services Baru

| Service | Isi |
|---|---|
| `speechRecognition.ts` | `isSpeechRecognitionSupported()`, `createSpeechRecognizer(callbacks)` — murni wrapper `SpeechRecognition`/`webkitSpeechRecognition`, tanpa state React |
| `mockTutor.ts` | `class MockTutorProvider implements TutorProvider` — bank respons Arab per skenario (5 varian/skenario), delay acak 800–1500 ms, tidak pernah mengulang respons yang sama persis dua kali berturut-turut per skenario |

### Titik integrasi AI di masa depan

```ts
// hari ini:
const conversation = useConversation(scenario); // default: mockTutorProvider

// nanti, cukup satu baris berubah:
const conversation = useConversation(scenario, geminiTutorProvider);
```

`GeminiTutorProvider` tinggal dibuat sebagai `class GeminiTutorProvider
implements TutorProvider` di `services/geminiTutor.ts`, memanggil
`server/index.js` yang sudah ada (`POST /api/chat/stream`). Tidak ada
komponen UI yang perlu diubah — `ChatBubble`, `MicButton`,
`TranscriptEditor`, dst. semuanya hanya bicara dengan `useConversation`,
tidak pernah tahu siapa di baliknya.

## 4. Komponen Baru/Diperbarui

- **`TranscriptEditor`** (baru) — input dwiarah (RTL saat berisi teks
  Arab), tombol Copy & Clear muncul otomatis saat ada isi, tombol Send
  terpisah. Dipakai baik untuk hasil rekaman maupun ketikan manual —
  satu komponen, dua jalur input, **tidak pernah auto-send**.
- **`EmptyStateCard`** — sekarang berisi pesan selamat datang, penjelasan
  cara kerja, 2 contoh frasa Arab (dengan tombol dengar), dan grid 8
  skenario (bukan 4 seperti sebelumnya).
- **`MicButton`** — 4 state eksplisit (`idle/listening/processing/finished`)
  masing-masing dengan ikon, label, dan animasi berbeda (ring berdenyut
  reaktif volume saat `listening`, spinner saat `processing`, pop-scale
  hijau saat `finished`).
- **`ChatBubble`** — tambah timestamp per pesan, tombol "Kirim ulang"
  inline pada pesan yang gagal terkirim.

## 5. Alur Pengguna (sesuai Goal)

1. Buka `/bicara-ai` → tampil welcome + 8 skenario.
2. Pilih skenario (mis. Restoran) → konteks percakapan aktif, area chat
   kosong siap pakai.
3. Tekan mic → bicara → tekan lagi untuk berhenti (atau tombol Space).
4. Transkrip muncul **di kolom yang bisa diedit** — bisa diedit, dihapus,
   disalin, atau direkam ulang.
5. Tekan Send secara eksplisit → baru terkirim.
6. Typing indicator muncul 800–1500 ms → balasan tutor muncul (teks Arab
   + terjemahan), dibacakan otomatis lewat TTS.
7. Percakapan lanjut — ulangi dari langkah 3.

Diverifikasi end-to-end lewat browser sungguhan (bukan asumsi): skenario
dipilih, transkrip diketik dan dikonfirmasi **tidak** muncul di chat
sebelum Send ditekan, balasan mock spesifik-skenario muncul dengan
timestamp, dan **nol** request jaringan ke backend (`localhost:8787` atau
`/api/*`) sepanjang seluruh alur — dites dengan backend benar-benar
dimatikan, bukan cuma diasumsikan tidak dipanggil.

## 6. Ringkasan Perbaikan UX

- Onboarding lebih ramah: welcome message + contoh frasa yang bisa
  langsung didengar sebelum pengguna commit ke satu skenario.
- 8 skenario nyata (bukan 4) mencakup situasi sehari-hari sampai formal
  (wawancara kerja, bandara).
- Kontrol penuh atas apa yang dikirim — tidak ada lagi "ke-record terus
  auto-kirim tanpa sempat koreksi", sekarang selalu ada jeda edit.
- Variasi respons per skenario menghindari kesan robotik ("kok jawabannya
  itu-itu lagi").
- State rekam yang eksplisit (4 tahap dengan animasi berbeda) membuat
  pengguna selalu tahu app sedang di fase apa — tidak pernah ada momen
  "diam tanpa penjelasan".
- Independen total dari backend — fitur ini akan selalu bisa dipakai
  bahkan kalau layanan AI (Gemini) sedang bermasalah, karena secara
  arsitektur memang terpisah.

## 7. Verifikasi

- `tsc -b` — bersih, 0 error.
- `oxlint` — bersih (2 warning fast-refresh pra-eksisting dari Sprint 1,
  tidak terkait perubahan ini).
- `vite build` — sukses, `AiSpeakingSession` tetap code-split terpisah
  (28 KB, gzip 10.2 KB).
- End-to-end via browser sungguhan dengan **backend benar-benar dimatikan**:
  pilih skenario → ketik → konfirmasi belum terkirim → Send → typing
  indicator → balasan scenario-specific dengan terjemahan & timestamp →
  TTS otomatis bicara. Nol error console, nol request ke backend.
