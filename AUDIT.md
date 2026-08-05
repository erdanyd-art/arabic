# UX Audit — Lisan Coach v1 → Redesign Brief

> Audit dilakukan terhadap implementasi v1 (commit `c7bd00c`) dengan cara
> menjalankan aplikasi secara langsung (dev server + browser headless) dan
> membaca seluruh kode sumber. Temuan di bawah adalah dasar dari redesign
> yang mengikuti dokumen ini.

## 1. Inventaris

**9 layar**: Home, ModeSelect, VocabSetup, VocabSession, SentenceSetup,
SentenceSession, ConversationSetup, ConversationSession, QuranList,
QuranReader, GuideDetail (Umrah/Haji berbagi satu route).

**8 komponen UI**: PageShell, SessionHeader, PrimaryButton, SegmentedControl,
TopicCard, ProgressBar, AudioButton, RecordButton — semuanya *ad hoc*,
tidak ada lapisan primitive (button/card/input) yang benar-benar reusable
di level atom. Setiap layar menulis ulang class Tailwind mentah untuk pola
yang sama (kartu putih + shadow-sm + rounded-2xl muncul di 11 tempat berbeda
dengan penulisan berbeda-beda).

## 2. Masalah UX Mayor

1. **Tidak ada onboarding.** Pengguna baru langsung dilempar ke Home kosong
   tanpa penjelasan apa itu "Lisan Coach", bagaimana cara kerja audio TTS,
   atau kenapa perlu izin mikrofon. Referensi kompetitor (Duolingo, ELSA)
   selalu punya 1-2 layar value proposition + permission priming sebelum
   sesi pertama.
2. **Tidak ada feedback pengucapan yang sesungguhnya.** `RecordButton`
   merekam & memutar ulang suara pengguna, tapi tidak ada perbandingan
   dengan skor/analisis apa pun — untuk produk yang mengklaim "AI speaking
   coach", ini adalah kesenjangan fitur inti, bukan kosmetik.
3. **"Buat Sendiri" adalah dead UI.** Tab ini ada di 3 layar setup
   (Kosakata/Kalimat/Percakapan) tapi tidak pernah bisa diklik ke state lain
   — `SegmentedControl` di-hardcode ke `value="preset"` tanpa handler nyata.
   Fitur terlihat ada, tapi tidak berfungsi.
4. **Toggle Dialek & Gender Suara dikumpulkan tapi tidak dipakai.** State
   `dialect`/`gender` di-set lewat UI namun tidak pernah dibaca oleh
   `speakArabic()` — janji UI (pilih suara pria/wanita) tidak ditepati oleh
   sistem.
5. **Tidak ada loading state untuk transisi setup → sesi.** Screenshot
   referensi menunjukkan tombol "Menyiapkan..." (mengindikasikan proses
   async, mis. generate konten), tapi implementasi v1 langsung `navigate()`
   secara instan — terasa murah, tidak ada anticipation/delight.
6. **Empty & error state minim.** Hanya Home yang punya empty state.
   `VocabSession`/`SentenceSession`/`ConversationSession`/`QuranReader`/
   `GuideDetail` semua menampilkan satu baris teks abu-abu polos saat data
   tidak ditemukan — tidak konsisten, tidak actionable (tidak ada tombol
   kembali di dalam pesan itu sendiri).
7. **Tidak ada dark mode**, padahal ini aplikasi belajar yang realistis
   dipakai malam hari (banyak sesi Al-Quran/doa dibaca setelah Isya).

## 3. Inkonsistensi UI (temuan terukur dari kode)

| Aspek | Temuan | Masalah |
|---|---|---|
| Warna | 45 kombinasi `bg/text/border-{warna}-{shade}` unik, ditulis langsung tanpa token semantik | Tidak ada "primary/success/danger" konsisten — indigo, purple, pink, amber semua dipakai bergantian sebagai aksen tanpa aturan jelas |
| Tipografi | `text-xs`/`text-sm` mendominasi 64 dari ~73 pemakaian; hanya 1 `text-4xl`, 2 `text-2xl` | Hierarki nyaris datar — hampir semua teks di 12–14px, sulit membedakan judul vs isi vs label |
| Radius | `rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-full` dipakai campur tanpa pola (kartu topik `2xl`, tombol kadang `xl` kadang `2xl`) | Tidak ada skala radius yang konsisten per jenis elemen |
| Elevasi | Hanya satu varian: `shadow-sm`, dipakai rata di 18 tempat — tombol, kartu, header semua elevasi sama | Tidak ada hierarki depth (resting vs hover vs active vs modal) |
| Fokus keyboard | **0** penggunaan `focus-visible`/`focus:ring` di seluruh kode | Navigasi keyboard tidak terlihat sama sekali — blocker aksesibilitas serius |

## 4. Masalah Arsitektur Informasi

- **3 halaman setup nyaris identik** (`VocabSetup`, `SentenceSetup`,
  `ConversationSetup`) — level select, tab switcher, grid topik, CTA — ditulis
  3x terpisah alih-alih satu komponen terparameterisasi. Perubahan pola (mis.
  menambah validasi) harus diulang 3x.
- **Header sesi tidak konsisten**: `SessionHeader` dipakai di beberapa layar,
  tapi `ConversationSession` menulis ulang header-nya sendiri dari nol
  (bukan reuse) karena butuh tombol tambahan — menghasilkan duplikasi logic
  tombol back/home.
- **Riwayat sesi di Home** menyimpan `score/total` tapi tidak ada cara
  melihat detail sesi lampau atau mengulanginya langsung dari riwayat.

## 5. Aksesibilitas

- Tidak ada `focus-visible` ring → keyboard user kehilangan jejak posisi.
- Kontras `text-slate-400`/`text-slate-500` di atas background gradient
  pastel berisiko di bawah rasio WCAG AA pada beberapa kombinasi.
- `RecordButton` tidak mengumumkan status rekam ke screen reader (tidak ada
  `aria-live` saat status berubah idle → recording → recorded).
- Tidak ada `lang="ar"` pada elemen teks Arab — screen reader akan
  membacanya dengan aturan fonetik bahasa halaman (Indonesia/Inggris),
  bukan Arab.
- Tombol ikon-only (`AudioButton`, tombol back/home) sudah punya
  `aria-label` — ini salah satu hal yang **sudah benar** dan dipertahankan.

## 6. Performa & Rekayasa

- `AnimatePresence mode="wait"` di root router menyebabkan seluruh pohon
  komponen unmount-remount di setiap navigasi — termasuk re-render layar
  yang tidak berubah, sedikit boros untuk transisi sesederhana ini.
- Tidak ada code-splitting per route (`React.lazy`) — bundle tunggal 429 KB
  akan terus membengkak seiring modul baru ditambahkan (Quran penuh 114
  surah, misalnya).
- State server/async (simulasi generate konten) tidak dikelola lewat
  lapisan data-fetching apa pun — semua `useState` lokal, sulit dipakai
  ulang polanya (retry, cache, error boundary) saat nanti disambungkan ke
  API sungguhan.

## 7. Fitur yang Hilang (dibanding kelas produk Duolingo Max / ELSA / Speak)

- Skor/feedback pengucapan (meski hanya heuristik lokal, bukan wajib model
  AI penuh).
- Progress harian / streak / ringkasan mingguan.
- Onboarding + permintaan izin mikrofon yang diberi konteks.
- Dark mode.
- Pengaturan (preferensi suara, kecepatan default, reset progres).
- Status sesi "belum selesai, lanjutkan?" — saat ini keluar dari sesi = data
  hilang total, tidak ada resume.

## 8. Prioritas Redesign

Berdasarkan temuan di atas, redesign difokuskan pada (urutan dampak):

1. Design system token (warna semantik, tipografi, radius, elevasi, dark
   mode) — menyembuhkan §3 sekaligus.
2. Lapisan primitive reusable (button/card/input/select/tabs/progress/
   switch/dialog/skeleton/toast) — menyembuhkan duplikasi di §4.
3. Satu komponen `ExerciseSetupScreen` generik menggantikan 3 halaman setup.
4. Alur async nyata (TanStack Query) untuk transisi setup → sesi, termasuk
   state loading yang terasa hidup.
5. Form topik custom fungsional (React Hook Form + Zod) — mengaktifkan tab
   "Buat Sendiri" yang sebelumnya mati.
6. Aksesibilitas: focus ring, `aria-live` pada status rekam, `lang="ar"`
   pada teks Arab, audit kontras warna teks sekunder.
7. Onboarding ringan + empty/error state yang konsisten dan actionable di
   semua layar sesi.
