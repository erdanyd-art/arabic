# Sprint 2.2 — Transform the AI into a Real Arabic Tutor

> Fokus: bukan UI, tapi *perilaku* AI. Tutor sebelumnya menjawab dengan
> baik tapi jarang memimpin — sesi terasa seperti chatbot yang menunggu,
> bukan tutor pribadi yang aktif mengajar.

## 1. Kenapa terasa seperti chatbot (diagnosis)

Lima modul prompt yang ada (`persona.ts`, `feedback.ts`, `scenario.ts`,
`evaluation.ts`, `system.ts`) semuanya mengatur *nada* atau *format* —
tidak satu pun mengatur *strategi percakapan*:

- `RESPONSE_FORMAT_PROMPT` di `system.ts` hanya bilang "1-3 kalimat
  Arab" — **tidak ada aturan bahwa balasan harus diakhiri pertanyaan**.
  Model secara wajar menjawab lalu berhenti, karena tidak ada yang
  bilang "kembalikan giliran bicara ke pengguna".
- `scenario.ts` lama hanya bilang "perankan lawan bicara yang wajar...
  misalnya pelayan, petugas, teman, dst." — peran ditebak sendiri oleh
  model, bukan ditentukan tegas, sehingga rawan keluar karakter.
- `evaluation.ts` sepenuhnya terpisah dari balasan percakapan — dorongan
  "lanjut bicara" yang seharusnya menjaga momentum malah terkubur di
  field `suggestion` yang tersembunyi di balik toggle "Lihat evaluasi",
  bukan di balasan yang langsung terlihat pengguna.
- Tidak ada adaptasi berdasarkan `difficulty` — level cuma jadi label
  teks, bukan instruksi perilaku.

## 2. Perbaikan arsitektur prompt

| File | Peran baru |
|---|---|
| `prompts/persona.ts` | + satu baris: tutor proaktif memegang kendali percakapan (bukan menunggu) |
| `prompts/conversation.ts` **(baru)** | Teaching loop 5 langkah untuk balasan Arab: tanggapi → apresiasi secukupnya → koreksi halus → ajarkan satu hal (opsional) → **wajib tutup dengan satu pertanyaan lanjutan**. Plus target rasio bicara 60% pengguna / 40% tutor. |
| `prompts/difficulty.ts` **(baru)** | `buildDifficultyPrompt(difficulty)` — pemula/menengah/lanjutan benar-benar mengubah panjang & kompleksitas kalimat, bukan cuma label |
| `prompts/scenario.ts` | Peran dipetakan tegas per skenario (Restoran→Pelayan, Bandara→Petugas imigrasi, Belanja→Pemilik toko, Wawancara→Pewawancara, Hotel→Resepsionis, Kelas→Guru, + Harian/Teman) dengan sikap spesifik per peran, dan larangan keluar karakter |
| `prompts/feedback.ts` | Diperjelas cakupannya khusus untuk JSON evaluation (bukan balasan percakapan) + aturan variasi pujian |
| `prompts/evaluation.ts` | Aturan baru: hindari kalimat template ("Bagus!", "Tata bahasa sudah benar" polos), setiap note ditulis spesifik untuk kalimat itu, suggestion harus konkret & kontekstual |
| `prompts/system.ts` | Merakit semua modul, urutan: persona → scenario+difficulty → **conversation strategy** → feedback+evaluation → format kontrak. `RESPONSE_FORMAT_PROMPT` sekarang eksplisit mewajibkan salah satu kalimat jadi pertanyaan lanjutan. |

Tidak ada giant prompt string baru — pola modular yang sama dipertahankan,
cuma ditambah dua modul baru sesuai kebutuhan.

## 3. Verifikasi ke Grok sungguhan (bukan mock)

Sesi 4-giliran di skenario Restoran (pelayan):

| Giliran pengguna | Balasan tutor | Diakhiri pertanyaan? | Tetap in-character? |
|---|---|---|---|
| "Halo, saya mau meja untuk 2 orang" | "Selamat datang! Meja untuk dua orang di sini. Mau lihat menu?" | ✅ | ✅ pelayan |
| "Ya, dekat jendela ya" | "Meja dekat jendela sudah siap. Mau lihat menu sekarang?" | ✅ | ✅ pelayan |
| "Saya mau pizza dan jus jeruk" | "Baik. Pizza dan jus jeruk. Ada lagi?" | ✅ | ✅ pelayan |
| "Tidak, itu saja terima kasih" | "Baik, saya akan bawa makanan sekarang. Mejanya nyaman?" | ✅ | ✅ pelayan |

**4 dari 4 giliran** ditutup pertanyaan relevan yang berbeda-beda (tidak
mengulang pola persis sama), tanpa pernah keluar dari peran pelayan atau
menyebut diri "AI".

Uji kedua — dua kalimat sengaja dibuat dengan kesalahan tata bahasa nyata
("أريد أكل بيتزا...", "أريد أشرب عصير...") untuk cek kualitas evaluasi:
keduanya terdeteksi salah secara spesifik ("`أريد أكل` seharusnya `أريد`
saja", "`أريد أشرب` kurang tepat, sebaiknya `أريد عصير` saja") dengan
rewrite natural yang benar dan saran lanjutan yang kontekstual — tidak ada
kalimat pujian template berulang.

`tsc -b`, `oxlint`, `vite build` — semua bersih. Nol error console
selama sesi percakapan real-API. `max_tokens: 900` di backend terbukti
cukup (tidak ada respons terpotong), jadi tidak diubah.

## 4. Perubahan UX (kecil, mendukung — bukan redesain)

`TypingIndicator.tsx` — status "berpikir" sekarang berputar
(`Lisan menyimak... → Menyusun balasan... → Menyiapkan evaluasi...`) alih-alih
cuma titik-titik diam, supaya jeda wajar dari model reasoning terasa
seperti tutor yang benar-benar bekerja, bukan macet. Tidak ada perubahan
layout/redesain lain di luar ini.

## 5. Kualitas kode

- Tidak ada logika prompt di komponen UI — semua tetap lewat
  `useConversation` → `tutorService` → `AiProvider`, tidak berubah.
- Setiap modul prompt baru punya satu tanggung jawab jelas (strategi
  percakapan vs. adaptasi level vs. peran skenario), tidak ada duplikasi.
- `buildDifficultyPrompt` dipakai balik oleh `scenario.ts` — satu sumber
  kebenaran untuk aturan level, tidak diulang di `conversation.ts`.
