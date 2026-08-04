# Spesifikasi UX — Lisan Coach (aplikasi inspirasi, implementasi orisinal)

> Disusun dari pengamatan visual terhadap aplikasi referensi ("EL Arabic").
> Tidak ada kode, aset, teks konten, atau data sumber yang disalin — dokumen ini
> hanya mendeskripsikan **pola interaksi dan struktur UX** untuk dijadikan acuan
> pembangunan ulang dari nol dengan konten & implementasi orisinal.

## 1. Konsep produk

Aplikasi latihan pengucapan Bahasa Arab. Pengguna memilih salah satu dari
beberapa **mode latihan**, mengonfigurasi parameter (level, topik/situasi,
dialek), lalu menjalani sesi latihan interaktif satu halaman (single-page
session) dengan progres yang terlihat.

## 2. Struktur navigasi

```
/                          Beranda (daftar sesi + tombol mulai)
/pilih-mode                 Pemilihan jenis latihan (6 kartu mode)
/kosakata/setup              Setup: level, topik, dialek
/kosakata/sesi/:topicId       Sesi kuis kosakata
/kalimat/setup                Setup: level, topik/teks sendiri, aksen, gender suara
/kalimat/sesi/:topicId          Player latihan kalimat
/percakapan/setup                Setup: level, situasi/buat sendiri
/percakapan/sesi/:situationId      Dialog interaktif dua peran
/quran                              Daftar surah (grid/list, filter surah/juz)
/quran/:surahId                      Pembaca ayat + terjemahan
/panduan/:jenis (umrah|haji)         Daftar rukun/tahapan dengan kartu ekspansi
```

Navigasi utama memakai `back arrow` (kembali ke setup) dan `home icon`
(langsung ke beranda) di header setiap sesi — pola konsisten di semua mode.

## 3. Halaman & state

### 3.1 Beranda
- Header: nama app + tagline singkat.
- CTA utama tunggal, tombol lebar penuh, warna aksen kuat (indigo).
- **Empty state**: ikon buku terbuka, teks "belum ada sesi", instruksi singkat
  mengarah ke CTA.
- (Non-empty state, disimpulkan): daftar sesi tersimpan/riwayat sebagai kartu,
  meski tidak teramati langsung — akan diimplementasikan sebagai riwayat sesi
  lokal (localStorage via Zustand persist).

### 3.2 Pemilihan mode latihan
- Judul + subjudul tanya ("mau latihan apa hari ini?").
- List vertikal 6 kartu, tiap kartu: ikon berwarna dalam kotak rounded,
  judul + 1 baris deskripsi, chevron kanan. Ini pola **list-item card**, bukan
  grid — konsisten dipakai ulang di tempat lain untuk daftar pilihan panjang.
- Mode: Kosakata, Kalimat, Percakapan, Baca Al-Quran, Panduan Umrah, Panduan
  Haji.

### 3.3 Layar setup (pola dipakai ulang di Kosakata/Kalimat/Percakapan)
Struktur identik di ketiga mode, hanya label & isi topik berbeda:
1. Judul mode + deskripsi singkat.
2. **Level** — dropdown select (mis. Pemula/Menengah/Mahir).
3. **Tab switcher** dua opsi: "Pilih Topik" (preset) vs "Buat Sendiri"
   (custom/freeform, kemungkinan generative).
4. **Grid topik** 2 kolom, kartu topik (judul dwibahasa + contoh singkat di
   bawahnya). Salah satu mode punya opsi "Pilih Topik Acak" di pojok kanan
   atas grid.
5. Interaksi pilih: klik kartu → border highlight (kuning/amber) sebagai
   indikator terpilih, bukan checkbox terpisah.
6. **Opsi tambahan** di bawah grid: toggle dialek (Formal/Sehari-hari),
   toggle gender suara (Laki-laki/Perempuan) — hanya muncul di mode tertentu.
7. Tombol CTA lebar penuh warna oranye di bagian bawah, berubah label saat
   loading ("Menyiapkan...") — mengindikasikan generasi konten async
   (mis. panggilan AI) sebelum sesi dimulai.

### 3.4 Sesi Kosakata (kuis kartu)
- Header: tombol kembali, judul topik, indikator "kata X dari N · Y selesai",
  tombol home.
- Progress bar tipis di bawah header, terisi proporsional.
- Kartu pusat: karakter Arab besar + tombol audio bulat di sampingnya,
  transliterasi Latin di bawah karakter.
- Prompt kuis "APA ARTI KATA INI?" dengan 3 pilihan jawaban bergaya
  tombol/list — pilihan diberi highlight kuning setelah dijawab (indikasi
  benar/salah).
- Navigasi Sebelumnya/Berikutnya di bawah, tombol "Sebelumnya" disabled di
  kata pertama.

### 3.5 Sesi Kalimat (player audio-teks)
- Toolbar atas: back, stop, replay, play/pause (tombol utama lingkaran
  ungu), next, tombol "Terjemahkan" (toggle terjemahan per kalimat),
  kontrol kecepatan (0.5x–1.5x sebagai pill selector), toggle ulang
  otomatis (loop).
- Slider vertikal di tepi kanan — kemungkinan kontrol volume atau kecepatan
  scroll konten panjang.
- Daftar kalimat bernomor (01, 02, 03...) dalam kartu terpisah, teks Arab
  besar rata tengah. Kartu aktif kemungkinan di-highlight saat diputar.

### 3.6 Sesi Percakapan (dialog dua peran)
- Header: back, judul situasi dwibahasa, label dua peran (mis. penjual vs
  pelanggan) dengan progres "X/Y selesai", tombol terjemahkan, tombol play
  global, tombol home.
- Alur chat bubble bergantian kiri/kanan seperti UI pesan instan:
  - Peran A (kanan, warna aksen/pink, ada avatar bulat).
  - Peran B (kiri, putih/netral, ada avatar bulat).
- Tiap bubble punya dua aksi kecil: "Dengar" (putar audio baris ini) dan
  "Latihan" (rekam pengucapan pengguna untuk baris ini) — pola
  **listen-then-repeat** per baris dialog.

### 3.7 Modul konten (Al-Quran, Umrah, Haji) — disimpulkan dari deskripsi kartu
- Baca Al-Quran: daftar/telusuri per surah atau per juz, tampilan ayat +
  terjemahan Indonesia, kemungkinan audio per ayat (pola serupa 3.5).
- Panduan Umrah/Haji: konten terstruktur per rukun/syarat/sunnah/tahapan,
  disertai doa & hadits — cocok dengan pola accordion/expandable list.

## 4. Komponen UI yang dipakai berulang

| Komponen | Dipakai di | Catatan |
|---|---|---|
| Kartu pilihan dengan border-highlight saat aktif | Setup semua mode | State via class, bukan komponen checkbox |
| Tab switcher 2-opsi (pill) | Setup semua mode, toggle dialek/gender | Reusable `SegmentedControl` |
| Progress bar tipis di header sesi | Kosakata, Percakapan | Reusable `SessionProgressBar` |
| Tombol audio bulat kecil | Kosakata (per kata), Percakapan (Dengar) | Reusable `AudioButton` |
| Player toolbar (play/pause/speed/loop) | Kalimat | Reusable `AudioPlayerControls` |
| Chat bubble dua arah | Percakapan | Reusable `DialogueBubble` |
| CTA lebar penuh, warna berbeda per konteks (indigo=aksi utama, oranye=mulai) | Semua halaman | Konsisten sebagai `PrimaryButton` |

## 5. Palet & tone visual (diamati, akan diadaptasi—bukan disalin persis)

- Background: gradient lembut biru-keunguan ke pink pastel (mengesankan
  suasana tenang/ramah, bukan flat white).
- Aksen utama: indigo/ungu untuk aksi navigasi (mis. tombol "+ Latihan
  Baru", tombol play).
- Aksen sekunder: oranye/amber untuk CTA "mulai" & progress bar — kontras
  hangat sebagai penanda "aksi maju".
- Highlight state terpilih/benar: kuning pucat.
- Peran dialog dibedakan warna (pink vs putih) agar mudah dipindai secara
  visual siapa berbicara.
- Font tebal rounded untuk judul (kesan ramah/edukasi kasual), teks Arab
  memakai font Arab standar besar agar mudah dibaca.

## 6. Validasi & state edge-case yang perlu diimplementasikan

- Setup: CTA "Mulai Latihan" nonaktif/beri warning bila topik belum dipilih
  (untuk mode "Buat Sendiri", validasi input teks tidak boleh kosong).
- Sesi kuis: cegah lanjut ke soal berikut tanpa menjawab (opsional — bisa
  dibuat lebih permisif agar UX tidak memaksa).
- Loading state saat "menyiapkan" konten (skeleton/disabled button + label
  berubah).
- Empty state riwayat di beranda.
- Sesi selesai: perlu layar ringkasan/completion yang tidak teramati di
  screenshot — akan dirancang orisinal (skor, tombol ulangi, tombol kembali
  ke beranda).

## 7. Yang SENGAJA tidak ditiru

- Nama merek, logo, watermark, dan atribusi akun sumber konten yang terlihat
  di salah satu tangkapan layar — **tidak** direproduksi dalam bentuk apa
  pun.
- Teks/kalimat Arab spesifik dan data ayat/topik persis dari aplikasi
  referensi — konten latihan pada implementasi baru akan berupa data contoh
  orisinal yang disusun sendiri, terpisah dari fokus UX pada dokumen ini.
- Tidak ada asset gambar/font kustom milik aplikasi asli yang diunduh atau
  digunakan.
