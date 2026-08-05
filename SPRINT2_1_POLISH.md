# Sprint 2.1 — Product Polish & Core Experience

> Polish pass di atas Sprint 2 (mock tutor). Tidak ada logic yang ditulis
> ulang — hanya identitas, hierarki visual, dan micro-interaction yang
> ditingkatkan. Semua perilaku inti dari Sprint 2 (non-auto-send, 8
> skenario, mock delay 800–1500ms, dst.) tetap persis sama.

## 1. Perbaikan UX

| Area | Sebelum | Sesudah |
|---|---|---|
| Identitas | Avatar "AI" generik, tanpa nama | Tutor bernama **"Lisan"**, avatar+status "Siap membantumu berlatih", indikator online (titik hijau) |
| Kesan pertama | Langsung ke daftar skenario | Hero "Arabic Speaking Coach" + tagline, lalu perkenalan tutor, baru daftar skenario — pengguna tahu ini aplikasi latihan bicara, bukan chatbot generik |
| Titik mulai | 8 skenario setara, tidak ada arahan | Badge **"⭐ Mulai di sini"** di skenario "Percakapan Harian" sebagai rekomendasi eksplisit |
| Status AI | Tidak ada disclosure sampai terjadi error | Banner tenang di awal ("Latihan bicara AI penuh belum aktif") + 3 link langsung ke Kosakata/Kalimat/Percakapan — transparan sejak awal, bukan menunggu gagal dulu |
| Aksi cepat | Tombol teks (Retry/.md/Hapus) sejajar kanan | Toolbar ikon dengan tooltip, seimbang, + aksi baru **"Percakapan Baru"** (reset skenario, bukan cuma hapus pesan) |
| Ritme pesan | Semua pesan berjarak sama rata | Jarak lebih rapat dalam satu pertukaran (user→tutor), lebih longgar antar giliran — chat terasa berkelompok per topik, bukan aliran datar |
| Konsistensi bahasa | "AI sedang bicara", avatar "AI" di berbagai tempat | Semua instance memakai nama "Lisan" secara konsisten (bubble, typing indicator, speaking bar) |

## 2. Komponen Ditambahkan/Diperbaiki

**Baru:**
- `TutorIdentity.tsx` — identitas tutor reusable, 2 varian ukuran (`lg` untuk hero, `sm` untuk strip sesi aktif)
- `AiPreviewNotice.tsx` — disclosure tenang + 3 link alternatif mode

**Diperbaiki (bukan ditulis ulang):**
- `EmptyStateCard.tsx` — tambah hero block, integrasi `TutorIdentity`, badge rekomendasi, animasi `whileHover`/`whileTap` di kartu skenario
- `SessionControlsBar.tsx` — dari tombol teks ke icon-toolbar dengan `Tooltip`, tambah `onNewConversation`
- `ChatBubble.tsx`, `TypingIndicator.tsx`, `SpeakingBar.tsx` — avatar/label "AI" → "Lisan" (via satu sumber kebenaran `TUTOR_NAME`, bukan hardcode berulang)
- `AiSpeakingSession.tsx` — pasang semua komponen baru, tambah `handleNewConversation`, logic spacing per giliran bicara

## 3. Keputusan Desain & Rationale

- **Nama tutor "Lisan"** dipilih karena selaras dengan nama aplikasi ("Lisan Coach" dari Sprint 1) — pengguna belajar dengan satu entitas yang konsisten dari halaman awal sampai sesi bicara, bukan dua identitas terpisah (app-brand vs chat-AI-generik).
- **Disclosure AI di awal, bukan saat error** — daripada menunggu pengguna kecewa saat fitur gagal, kejujuran soal status "pratinjau" ditampilkan sejak halaman dibuka. Ini juga yang membuat Success Criteria "want to come back once AI becomes available" masuk akal — pengguna tahu ada versi lebih baik yang akan datang.
- **`TutorIdentity` dipisah dari `SessionControlsBar`** (bukan digabung satu komponen) — supaya toolbar aksi tetap murni tentang aksi, dan identitas tutor bisa dipakai ulang di tempat lain (mis. hero) tanpa membawa logic dialog konfirmasi hapus.
- **`TooltipProvider` dipasang lokal di `SessionControlsBar`**, bukan global di `main.tsx` — sempat saya coba taruh global, tapi itu menambah ~35 KB ke bundle awal yang dimuat SEMUA halaman padahal tooltip cuma dipakai satu fitur. Dipindah ke dalam chunk yang sudah lazy-loaded, bundle awal kembali ke ukuran semula.
- **Tidak ada "message grouping" berdasarkan role berurutan** — alur percakapan app ini selalu bergantian user→tutor→user (tidak pernah dua pesan berurutan dari role sama), jadi grouping berbasis role tidak akan pernah terpakai. Sebagai gantinya, grouping diterapkan berbasis **giliran bicara** (spacing rapat dalam satu pertukaran, longgar antar pertukaran) — lebih sesuai bentuk data sebenarnya.
- **Tidak menambah tombol History/Settings palsu** — brief minta "future-proof spacing" untuk itu, tapi tombol yang diklik dan tidak melakukan apa-apa adalah anti-pattern UX. Toolbar ikon yang sekarang dibangun sudah cukup fleksibel untuk menambah ikon baru kapan saja tanpa refactor tata letak.

## 4. Before vs After

| | Before | After |
|---|---|---|
| Kesan pertama | "Chatbot AI" generik | "Aplikasi latihan bicara Bahasa Arab" dengan tutor bernama |
| Titik mulai untuk pemula | Harus menebak sendiri skenario mana yang termudah | Diarahkan lewat badge rekomendasi |
| Transparansi status AI | Baru tahu saat sesuatu gagal | Tahu sejak halaman dibuka, dengan jalan keluar konkret |
| Bundle awal (semua halaman) | 292.24 KB (gzip ~91.6 KB) | Tetap 292.24 KB — penambahan Tooltip masuk ke chunk lazy, tidak membebani halaman lain |
| Aksi sesi | 3 tombol teks sejajar | Toolbar ikon + tooltip + 1 aksi baru (Percakapan Baru) |

## 5. Verifikasi

- `tsc -b` — bersih.
- `oxlint` — bersih (2 warning fast-refresh pra-eksisting, tidak terkait).
- `vite build` — sukses; bundle awal tidak membengkak berkat Tooltip di-scope lokal.
- End-to-end via browser sungguhan, light & dark mode: hero → tutor intro → contoh frasa (audio) → badge rekomendasi → pilih skenario → strip tutor + toolbar aktif → kirim pesan → typing indicator → balasan dengan spacing per giliran → Percakapan Baru mengembalikan ke scenario picker. Nol error console di kedua tema.
- Navigasi keyboard: Tab mencapai kartu skenario dengan ring fokus terlihat jelas, Enter berhasil memilih skenario.

## 6. Rekomendasi Sprint 3 (AI Integration)

1. **Sambungkan `GeminiTutorProvider`** — buat `services/geminiTutor.ts` implementasi `TutorProvider`, panggil `server/index.js` yang sudah ada (dormant sejak Sprint 2). Ganti satu baris di `useConversation(scenario, geminiTutorProvider)`, hapus `AiPreviewNotice` atau ubah jadi banner "AI aktif ✓".
2. **Feedback pengucapan** — sekarang transkrip hanya lewat Speech Recognition browser (tidak dinilai). Sprint 3 bisa kirim audio mentah ke Gemini (multimodal) untuk penilaian pelafalan, bukan cuma teks.
3. **Riwayat percakapan** — `useAppStore` dari Sprint 1 sudah py infra riwayat sesi; sesi bicara AI bisa mulai dicatat di situ (tanpa scoring/XP dulu, sekadar log "pernah latihan skenario apa kapan").
4. **Voice tutor yang lebih hidup** — TTS browser generik saat ini; kalau Gemini TTS (`gemini-2.5-flash-preview-tts`, sudah kelihatan tersedia di key sebelumnya) disambungkan, "Lisan" bisa punya suara yang konsisten lintas browser, bukan tergantung voice OS pengguna.
5. **Uji ulang toggle Kosakata/Kalimat setelah Gemini aktif** — pastikan pola disclosure "Mulai di sini" / preview-notice yang dipakai di sini bisa direplikasi ke fitur lain kalau relevan.
