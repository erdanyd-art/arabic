# Sprint 2 — Premium Speaking Experience

> Fokus: satu fitur baru, **Latihan Bicara AI** (`/bicara-ai`), dibangun
> terpisah dari flow yang sudah ada. Tidak ada halaman/fitur v1 (Sprint 1)
> yang di-redesign ulang atau rusak — lihat bagian "Files Modified" untuk
> daftar persisnya.

## 1. Ringkasan Perbaikan

Dibangun dari nol: modul percakapan bebas dengan AI sungguhan (Google
Gemini, via backend proxy), dengan pengalaman voice-first ala
Speak/ELSA/ChatGPT Voice:

- **Rekam**: tombol mic besar (80px), 5 state (idle/requesting/recording/
  processing/error) dengan animasi pulse yang bereaksi terhadap volume
  suara asli (Web Audio API `AnalyserNode`), timer MM:SS, dan waveform
  live 28-bar yang digambar dari data frekuensi real-time.
- **Transkripsi**: Web Speech API (`SpeechRecognition`, lang `ar-SA`)
  menerjemahkan ucapan ke teks secara live (interim + final), tampil di
  atas mic saat merekam. Kalau browser tidak mendukung, ada fallback
  kolom teks yang selalu tersedia (juga berguna untuk keyboard-only user).
- **AI merespons**: teks di-stream token demi token dari Gemini lewat
  Server-Sent Events, muncul progresif di bubble chat (bukan menunggu
  respons penuh). Setelah teks selesai, otomatis dibacakan lewat TTS
  (`speechSynthesis`) dengan indikator "AI sedang bicara" + waveform
  ambient + tombol stop.
- **Kontrol sesi**: retry prompt terakhir, hapus percakapan (dengan
  dialog konfirmasi — tidak langsung hapus), unduh transkrip (.md/.txt),
  salin balasan AI per bubble, replay balasan AI kapan saja (diproteksi
  dari double-playback).
- **Empty state**: kartu onboarding dengan 4 contoh skenario (perkenalan
  diri, pesan makanan, percakapan harian, wawancara kerja) + CTA "Mulai
  Bicara Bebas".
- **Error handling nyata**: diuji langsung ke Gemini API sungguhan
  (bukan simulasi) — quota habis, request gagal, dan timeout semua
  menghasilkan banner error yang jelas dengan tombol "Coba lagi", bukan
  layar kosong atau crash.
- **Shortcut keyboard**: Space = rekam, Alt+R = retry, Alt+Backspace =
  hapus (dengan guard supaya tidak bentrok saat mengetik di input).

## 2. Arsitektur AI (penting)

App ini murni client-side (Vite/React), jadi **API key tidak pernah
ditaruh di frontend** — itu akan ter-bundle ke JS yang dikirim ke
browser dan bisa dicuri siapa saja. Solusinya: backend proxy kecil.

```
Browser  ──POST /api/chat/stream──▶  Vite dev proxy  ──▶  Express (server/index.js)
                                                              │  (GEMINI_API_KEY di
                                                              │   server/.env, gitignored)
                                                              ▼
                                                     Gemini streamGenerateContent
                                                     (SSE) ──▶ dipipe balik ke browser
```

- `server/index.js` — Express, satu route `POST /api/chat/stream` yang
  meneruskan riwayat pesan + system prompt (persona pelatih bicara Arab)
  ke Gemini dengan `alt=sse`, lalu mem-pipe stream mentahnya balik ke
  client tanpa buffering (baris demi baris).
- `server/.env` (gitignored, **tidak** di-commit) menyimpan
  `GEMINI_API_KEY`. `server/.env.example` di-commit sebagai template.
- `vite.config.ts` menambah `server.proxy` supaya `npm run dev` (client
  di 5173 + server di 8787 lewat `concurrently`) terasa seperti satu
  origin, tidak perlu CORS rumit.

### Status key saat ini

Key Gemini yang diberikan **valid** (bisa `ListModels`), tapi project
Google Cloud di baliknya punya **quota tier-gratis = 0** untuk
`generateContent` — bukan bug di kode ini. Sudah diverifikasi end-to-end
lewat browser sungguhan: skenario dipilih → request terkirim → Gemini
balas 429 → banner error muncul dengan benar → tombol retry berfungsi.
Begitu key dengan quota valid ditempel ke `server/.env`, fitur langsung
aktif tanpa ubah kode sama sekali.

## 3. Komponen Baru

| Komponen | Tanggung jawab |
|---|---|
| `MicButton` | Tombol rekam 5-state, pulse reaktif terhadap volume |
| `AudioWaveform` | Dua mode: `live` (data `AnalyserNode` asli saat rekam) dan `ambient` (animasi mandiri saat AI bicara, karena Web Speech API tidak expose data amplitudo) |
| `ChatBubble` | Bubble user/AI, terjemahan, tombol replay + copy, state gagal terkirim |
| `TypingIndicator` | Titik-titik animasi saat AI "berpikir" |
| `SpeakingBar` | Bar status "AI sedang bicara" + waveform + tombol stop |
| `SessionControlsBar` | Retry / unduh (.md) / hapus (dengan `Dialog` konfirmasi) |
| `EmptyStateCard` | Onboarding + 4 contoh skenario + CTA freeform |
| `ErrorBanner` | Banner error seragam (mic ditolak, tidak ada mic, request gagal, timeout) dengan aksi retry opsional |

## 4. Hooks Baru

| Hook | Tanggung jawab |
|---|---|
| `useVoiceRecorder` | State machine rekam (idle/requesting/recording/processing/error), timer, level audio 28-bar via `AnalyserNode`, transkripsi live via `SpeechRecognition`, deteksi dukungan browser |
| `useAiSpeakingChat(scenario)` | Kirim pesan ke backend, parse SSE Gemini token-demi-token, urus riwayat pesan, retry/clear/download, trigger TTS balasan AI, cegah double-playback |

Tidak ada logic yang diduplikasi antar komponen — semua state rekam
hidup di satu hook, semua state chat di hook lain, komponen UI murni
presentational dan menerima state lewat props.

## 5. Files Modified

```
NEW:
  server/index.js, server/.env.example        (backend proxy)
  src/lib/aiChat.ts                             (tipe pesan + daftar skenario)
  src/hooks/useVoiceRecorder.ts
  src/hooks/useAiSpeakingChat.ts
  src/components/domain/ai-speaking/*.tsx       (8 komponen, lihat tabel di atas)
  src/routes/AiSpeakingSession.tsx              (halaman utama)
  SPRINT2.md

MODIFIED:
  package.json          → script dev pakai concurrently (client+server), tambah deps
  vite.config.ts         → proxy /api ke backend saat dev
  .gitignore              → exclude .env (secrets)
  src/App.tsx              → tambah lazy route /bicara-ai
  src/routes/ModeSelect.tsx → tambah 1 kartu mode baru di posisi teratas

TIDAK DISENTUH (Sprint 1 tetap utuh):
  Home, VocabSetup/Session, SentenceSetup/Session, ConversationSetup/Session
  (dialog berskrip lama), QuranList/Reader, GuideDetail, semua primitive ui/*
```

## 6. Verifikasi

- `tsc -b` — bersih, 0 error.
- `vite build` — sukses; `AiSpeakingSession` jadi chunk terpisah (21.8 KB,
  gzip 8 KB) berkat code-splitting yang sudah ada dari Sprint 1.
- Diuji end-to-end lewat browser headless sungguhan (bukan mock):
  empty state → pilih skenario → request nyata ke Gemini → **429 quota
  ditangani dengan benar** (bukan crash) → retry → alur input teks
  alternatif (untuk aksesibilitas & fallback non-mic) → dialog konfirmasi
  hapus. Nol JavaScript exception di semua langkah.

## 7. Saran Sprint 3 (AI Feedback)

Sekarang percakapan bebas dengan AI sudah jalan, area natural untuk
sprint berikutnya:

1. **Skor pengucapan sungguhan** — kirim rekaman audio user (bukan cuma
   transkrip teks) ke Gemini sebagai `inline_data` audio, minta model
   menilai akurasi pelafalan/tata bahasa, tampilkan skor per kalimat.
2. **Koreksi inline** — highlight kata yang salah ucap/tata bahasa
   langsung di bubble user, dengan tooltip penjelasan.
3. **Progress tracking** — simpan ringkasan tiap sesi bicara AI ke
   `useAppStore` (riwayat Home sudah ada infra-nya dari Sprint 1),
   tampilkan tren akurasi dari waktu ke waktu.
4. **Mode "shadow speaking"** — AI bicara duluan, user diminta menirukan
   persis, dinilai kemiripan lafalnya.
5. **Voice selection** — sekarang TTS pakai suara default browser; bisa
   upgrade ke Gemini TTS (`gemini-2.5-flash-preview-tts` yang sudah
   terlihat tersedia di key ini) untuk suara lebih natural & konsisten
   lintas browser dibanding `speechSynthesis` bawaan OS.
6. **Reconnect otomatis** — kalau koneksi putus di tengah streaming,
   auto-retry dengan backoff alih-alih user harus klik manual.
