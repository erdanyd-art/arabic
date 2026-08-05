# Sprint 3 — Build the Learning System

> Fokus: bukan AI, tapi retensi belajar. Setiap percakapan sekarang jadi
> materi belajar yang bisa dibuka lagi — bukan hilang begitu sesi selesai.

## 1. Yang tidak disentuh

Sesuai brief: tidak ada redesign AI, tidak ada auth/Supabase/gamifikasi/
pembayaran. Satu-satunya perubahan yang menyentuh sistem AI (disetujui
eksplisit sebelum implementasi) adalah field `goalsAddressed` opsional di
skema evaluasi (`prompts/evaluation.ts`) + daftar tujuan skenario yang
disuntik ke `prompts/scenario.ts` — dibutuhkan supaya tutor bisa menandai
tujuan latihan secara akurat, sesuatu yang keyword-matching lokal tidak
bisa lakukan dengan andal.

## 2. Arsitektur baru

```
storage/            ← persistence murni, tidak tahu React
  keys.ts             satu sumber kebenaran localStorage key
  localJsonStore.ts    primitif get/set/add/remove/update generik
  VocabularyStorage.ts, ExpressionStorage.ts, HistoryStorage.ts,
  GoalStorage.ts, SessionStorage.ts

features/            ← logic + komponen per fitur, terisolasi
  vocabulary/, expressions/, goals/, history/, summary/, review/,
  dashboard/, shared/ (useSavableCollection — search/filter/sort/favorite
  dipakai bareng oleh vocabulary & expressions, tidak diduplikasi)

routes/              ← tetap tipis: AppShell + TopBar + satu feature hook
                       + satu feature component, pola yang sama persis
                       dengan AiSpeakingSession.tsx yang sudah ada
```

Pola `services/` vs `hooks/` yang sudah ada di AI stack (`tutorService.ts`
↔ `useConversation.ts`) dipakai ulang persis: `storage/*` = lapisan
data, `features/*/use*.ts` = lapisan React di atasnya.

## 3. Delapan fitur

1. **Vocabulary Notebook** (`/kosakata-tersimpan`) — simpan kata dari
   evaluasi per-kalimat (tombol simpan baru di `EvaluationCard.tsx`),
   cari/filter skenario/favorit/hapus, selalu urut terbaru.
2. **Conversation History** (`/riwayat`, `/riwayat/:id`) — setiap sesi
   yang di-"Selesai"-kan tersimpan lengkap (transkrip, durasi, jumlah
   pesan, kosakata, level); dibuka lagi read-only lewat `ChatBubble`
   yang sama (prop `readOnly` baru, additive, tidak mengubah perilaku
   default).
3. **Session Summary** (`/ringkasan/:id`) — **dihitung deterministik dari
   data evaluasi yang sudah ada** (`features/summary/computeSessionSummary.ts`),
   nol panggilan AI tambahan: kosakata dedup, observasi tata bahasa dari
   catatan asli model, strengths/areas dari rasio benar & natural,
   skenario lanjutan dari heuristik kesulitan+riwayat terakhir.
4. **Learning Goals** — checklist per skenario (`GoalsChecklist.tsx`,
   collapsed by default di header sesi), progress live dari
   `evaluation.goalsAddressed` tiap giliran, diverifikasi sungguhan ke
   Grok: 3 pesan restoran (sapa, minta menu, pesan makanan) → checklist
   otomatis jadi 3/4.
5. **Saved Expressions** (`/ekspresi-tersimpan`) — bookmark balasan
   tutor lewat tombol baru di action row `ChatBubble`.
6. **Dashboard** — `Home.tsx` di-evolve (bukan halaman baru yang
   bersaing): Lanjutkan Sesi (kalau ada draft belum selesai) →
   Percakapan Terakhir → pratinjau Kosakata/Ekspresi tersimpan →
   Aktivitas Mingguan (7 bar polos, tanpa skor/streak). Riwayat kuis
   lama tetap ada di bawah, diberi label ulang biar tidak tertukar.
7. **Review Mode** (`/ulas`) — flashcard ringan dari kosakata+ekspresi
   gabungan, acak, tampilkan jawaban, tandai hafal/ulas lagi — tanpa
   algoritma spaced-repetition, sesuai permintaan "lightweight".
8. **Mobile polish** — diuji di viewport 375px untuk dashboard, sesi
   bicara, dan Buku Belajar; sticky bottom bar sesi tetap konsisten.

Plus **Buku Belajar** (`/buku-belajar`, entry baru di `ModeSelect`) —
shell bertab (Kosakata/Ekspresi/Riwayat/Ulas) yang memakai ulang persis
komponen fitur yang sama dengan rute standalone-nya, jadi satu
implementasi, dua jalan masuk.

## 4. Bug yang ditemukan & diperbaiki saat verifikasi

Teks Arab dengan `dir="rtl"` di dalam container lebar (baris daftar
kosakata/ekspresi, pratinjau dashboard, kartu evaluasi) rata kanan
sendiri sementara teks terjemahan di bawahnya rata kiri — hasilnya teks
berantakan tidak sejajar. Diperbaiki dengan `text-left` eksplisit di 4
tempat (`VocabularyEntryCard`, `ExpressionCard`, `SavedExpressionsPreview`,
`EvaluationCard`'s natural-rewrite line) — `dir="rtl"` tetap dipakai
untuk urutan huruf yang benar, cuma alignment visualnya yang diseragamkan
ke kiri supaya konsisten dengan baris lain. `ChatBubble` dan `Flashcard`
sudah benar dari awal karena container-nya shrink-to-fit/center, bukan
lebar penuh.

## 5. Verifikasi

`tsc -b`, `oxlint`, `vite build` bersih di tiap checkpoint (7 kali,
bukan cuma di akhir). End-to-end lewat Grok sungguhan: sesi restoran 6
pesan → checklist tujuan naik live jadi 3/4 → simpan 1 kosakata + 1
ekspresi → klik Selesai → ringkasan tampil dengan strengths/kosakata/saran
skenario lanjutan yang benar → muncul di Dashboard dan `/riwayat` →
dibuka lagi read-only → cek Buku Belajar 4 tab → sesi Ulas (reveal →
tandai hafal → kartu berikutnya) → ulang semua di viewport mobile. Nol
error console di sepanjang alur. Skrip Playwright sementara dan
`playwright-core` sudah dibersihkan setelah verifikasi selesai.

## 6. Catatan desain yang disengaja

- **"Continue Last Session" tidak resume transkrip persis** — cuma
  masuk lagi ke skenario yang sama (fresh conversation), karena
  `useConversation` tidak punya titik injeksi pesan awal dan
  `SessionStorage` sengaja one-way (state hidup → storage, tidak pernah
  dibaca balik) supaya tidak ada race/stale-overwrite. Sudah dikonfirmasi
  di plan sebelum implementasi.
- **`finishSession` membaca `HistoryStorage` sebelum menulis** — kalau
  urutannya kebalik, skenario yang baru selesai akan ikut terhitung saat
  menghitung saran skenario lanjutan (bias ke diri sendiri).
