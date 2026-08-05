# Redesign Report — Lisan Coach v2

> Lanjutan dari [`AUDIT.md`](./AUDIT.md). Dokumen ini merangkum apa yang
> dibangun ulang, bagaimana strukturnya, dan alasan arsitekturalnya.

## 1. Ringkasan Perbaikan

| # | Temuan audit | Perbaikan v2 |
|---|---|---|
| 1 | Tidak ada design token, 45 kombinasi warna mentah | Token semantik (`--color-primary`, `--color-accent`, `--color-success`, dst.) via Tailwind v4 `@theme`, dipakai konsisten lewat `cn()` + varian `cva` |
| 2 | Hierarki tipografi nyaris datar | Skala dipertegas: judul `font-extrabold`/`font-bold`, body `text-sm`, label `text-xs uppercase tracking-wide` — dipakai konsisten via primitive (`CardTitle`, `Label`, dst.) |
| 3 | 1 varian shadow, 1 varian radius dipakai serampangan | Skala elevasi (`shadow-resting/raised/floating`) & radius (`rounded-xs`…`rounded-xl`) sebagai token, bukan pilihan bebas per komponen |
| 4 | 0 `focus-visible` di seluruh kode | Global `:focus-visible` ring + tiap primitive Radix mewarisi keyboard nav bawaan (Select, Tabs, Dialog, Switch, Accordion, Tooltip) |
| 5 | 3 halaman setup duplikat | Satu `<ExerciseSetupScreen />` generik dipakai oleh Kosakata/Kalimat/Percakapan — masing-masing kini ~20–40 baris konfigurasi, bukan ~150 baris JSX yang diulang |
| 6 | Tab "Buat Sendiri" mati (dead UI) | Form fungsional dengan React Hook Form + Zod, validasi realtime, terhubung ke alur sesi yang sama (dengan pesan jujur bahwa generative-AI backend belum tersambung — tidak berpura-pura) |
| 7 | Transisi setup → sesi instan tanpa loading | `useGenerateSession` (TanStack Query `useMutation`) mensimulasikan proses async nyata dengan state `isPending` → tombol "Menyiapkan..." sungguhan, bukan kosmetik |
| 8 | Tidak ada dark mode | `ThemeProvider` custom (context + localStorage + `prefers-color-scheme`) meng-toggle class `.dark`; seluruh token warna punya pasangan light/dark |
| 9 | Empty/error state minim & tak konsisten | `<EmptyState />` reusable dipakai di semua sesi untuk topik/situasi yang tidak ditemukan, selalu dengan CTA kembali |
| 10 | Tidak ada onboarding | `<OnboardingDialog />` 3 langkah (dengar, rekam, belajar bertingkat) muncul sekali di kunjungan pertama, tersimpan di localStorage |
| 11 | Bundle monolitik, tidak ada code-splitting | `React.lazy` per rute di `App.tsx` — chunk awal turun dari 727 KB → 295 KB (gzip 228 KB → 92 KB) |
| 12 | `RecordButton` tidak mengumumkan status ke screen reader | `role="status" aria-live="polite"` mengumumkan idle/recording/recorded/ditolak |
| 13 | Teks Arab tanpa atribut `lang` | `lang="ar"` disematkan di setiap elemen `font-arabic` (kata, kalimat, dialog, ayat, doa) |

## 2. Design System

### Token warna (semantik, bukan palet mentah)
`background`, `foreground`, `surface`, `surface-muted`, `border`, `primary`
(+ `-foreground`, `-muted`), `accent`, `success`, `danger`, `muted-foreground`,
`role-a`/`role-b` (khusus pembeda peran dialog). Semua didefinisikan sekali di
`src/index.css` lewat Tailwind v4 `@theme`, otomatis menghasilkan utility
(`bg-primary`, `text-accent-foreground`, dst.) dan berubah nilai saat class
`.dark` aktif — komponen tidak pernah tahu apakah sedang light/dark.

### Skala lain
- **Radius**: `xs (8px) → sm → md → lg → xl (28px)`, dipilih per jenis elemen
  (input = `sm`, card = `lg`, tombol besar = `lg`, avatar/pill = `full`).
- **Elevasi**: `shadow-resting` (kartu diam) → `shadow-raised` (hover/tombol
  utama) → `shadow-floating` (dialog/popover).
- **Tipografi**: `Plus Jakarta Sans` untuk UI Latin, `Noto Naskh Arabic`
  untuk teks Arab — dipisah lewat class `.font-arabic` + atribut `lang="ar"`.

### Dark mode
Implementasi custom (bukan `next-themes`, sengaja dilepas agar tidak
menambah dependency yang tidak dibutuhkan di luar Next.js) — context kecil
di `src/providers/ThemeProvider.tsx`, ~30 baris, menyimpan preferensi di
`localStorage` dan fallback ke `prefers-color-scheme`.

## 3. Component Tree

```
main.tsx
└─ ThemeProvider
   └─ QueryProvider (TanStack Query)
      └─ BrowserRouter
         ├─ App (AnimatePresence + React.lazy routes)
         │  ├─ Home
         │  │  ├─ OnboardingDialog        (ui/dialog)
         │  │  ├─ ThemeToggle             (ui/button)
         │  │  └─ Card[] riwayat sesi     (ui/card, ui/badge)
         │  ├─ ModeSelect                 (ui/card)
         │  ├─ exercises/*Setup ──────────▶ ExerciseSetupScreen
         │  │                                ├─ TopBar
         │  │                                ├─ ui/select (Level)
         │  │                                ├─ ui/tabs (Preset ⇄ Custom)
         │  │                                │   ├─ grid TopicCard (inline)
         │  │                                │   ├─ OptionSwitchRow[] (ui/switch)
         │  │                                │   └─ CustomTopicForm (RHF + Zod)
         │  │                                └─ useGenerateSession (TanStack Query)
         │  ├─ exercises/VocabSession      (ui/card, ui/progress, domain/AudioButton)
         │  ├─ exercises/SentenceSession   (ui/card, domain player controls)
         │  ├─ exercises/ConversationSession (ui/avatar, domain/RecordButton, domain/AudioButton)
         │  ├─ QuranList / QuranReader     (ui/input, ui/card, domain/AudioButton)
         │  └─ GuideDetail                 (ui/accordion, domain/AudioButton)
         └─ Toaster (sonner, global)
```

`AppShell` + `TopBar` membungkus **setiap** layar (kecuali Home yang punya
header sendiri) — satu sumber kebenaran untuk padding, max-width, gradient
background, dan tombol back/home, menggantikan duplikasi header manual di
v1 (`ConversationSession` dulu menulis header sendiri dari nol).

## 4. Struktur Folder

```
src/
├─ components/
│  ├─ ui/            primitive tanpa pengetahuan domain (button, card, select,
│  │                  tabs, progress, switch, dialog, accordion, skeleton,
│  │                  sonner, badge, input, textarea, label, separator,
│  │                  avatar, tooltip) — layer paling reusable, mirip shadcn/ui
│  ├─ domain/         komponen yang tahu tentang "latihan Bahasa Arab":
│  │                  AudioButton, RecordButton, ExerciseSetupScreen,
│  │                  CustomTopicForm, OptionSwitchRow, EmptyState,
│  │                  OnboardingDialog
│  └─ layout/         AppShell, TopBar, ThemeToggle — kerangka tiap halaman
├─ providers/         ThemeProvider, QueryProvider — dipasang sekali di main.tsx
├─ hooks/              useGenerateSession (TanStack Query mutation)
├─ lib/                types, utils (cn), validation (Zod), speech (Web Speech API)
├─ data/               konten statis per modul (vocab/sentence/conversation/guide/surah)
├─ store/               useAppStore (Zustand + persist, riwayat sesi)
└─ routes/              satu file per layar; exercises/ untuk 3 modul latihan
```

Prinsip pemisahan: `ui/` tidak pernah mengimpor dari `domain/` atau
`routes/`; `domain/` boleh memakai `ui/`; `routes/` memakai `domain/` dan
`layout/`. Ini mencegah ketergantungan melingkar dan membuat `ui/` benar-benar
portable ke proyek lain.

## 5. Before vs After

| Aspek | v1 | v2 |
|---|---|---|
| Baris kode 3 halaman setup | ~330 baris (3× duplikat) | ~90 baris (3 file konfigurasi + 1 komponen generik ~210 baris dipakai bersama) |
| Warna | 45 kombinasi Tailwind mentah | 12 token semantik dengan pasangan light/dark |
| Dark mode | Tidak ada | Ada, toggle di Home, tersimpan di localStorage |
| Fokus keyboard | Tidak terlihat sama sekali | Ring konsisten di semua elemen interaktif |
| Tab "Buat Sendiri" | Dekoratif, tidak bisa diklik | Form tervalidasi, terhubung ke alur sesi |
| Transisi setup → sesi | Instan (`navigate()` langsung) | Async nyata via TanStack Query, tombol "Menyiapkan..." |
| Ukuran bundle awal | 429 KB (v1 baseline) / 727 KB setelah tambahan lib | 295 KB (gzip 92 KB) berkat `React.lazy` per rute |
| Empty/error state | 1 baris teks abu-abu, tidak konsisten | Komponen `EmptyState` seragam dengan CTA di semua sesi |
| Status rekam untuk screen reader | Tidak diumumkan | `aria-live="polite"` |
| Teks Arab & screen reader | Tanpa `lang` attribute | `lang="ar"` di semua teks Arab |
| Onboarding | Tidak ada | Dialog 3 langkah di kunjungan pertama |

## 6. Yang Sengaja Belum Dikerjakan (Backlog)

Supaya tidak asal menambah fitur di luar prioritas audit, hal-hal berikut
**dicatat sebagai backlog**, bukan diimplementasikan setengah jalan:

- Skor/analisis pengucapan sungguhan (masih rekam + putar ulang manual,
  butuh model ASR/pronunciation-scoring nyata).
- Halaman "Pengaturan" terpisah (kecepatan default, reset progres per modul).
- Resume sesi yang belum selesai.
- Ringkasan progres mingguan/streak.
- Integrasi API Al-Quran sungguhan (saat ini hanya Al-Fatihah & Al-Ikhlas
  berisi teks lengkap, sisanya placeholder "segera hadir").

## 7. Verifikasi

- `tsc -b` — bersih, 0 error (termasuk setelah `--force` full rebuild).
- `vite build` — sukses, tidak ada warning chunk besar setelah code-splitting.
- Diuji lewat browser headless (Playwright Chromium) di **light & dark
  mode**: onboarding → home → pilih mode → setup Kosakata → tab "Buat
  Sendiri" → pilih topik preset → loading "Menyiapkan..." → sesi kuis →
  jawab pertanyaan. Nol error console di kedua tema.
