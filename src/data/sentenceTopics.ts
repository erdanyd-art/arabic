import type { SentenceTopic } from "@/lib/types";

export const sentenceTopics: SentenceTopic[] = [
  {
    id: "transportasi",
    title: "Alat Transportasi",
    hint: "mobil, bus, kereta",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "أَنَا أَذْهَبُ إِلَى الْمَدْرَسَةِ بِالْحَافِلَةِ.", translation: "Saya pergi ke sekolah naik bus." },
      { id: "s2", arabic: "أَبِي يَقُودُ السَّيَّارَةَ كُلَّ يَوْمٍ.", translation: "Ayah saya menyetir mobil setiap hari." },
      { id: "s3", arabic: "الْقِطَارُ سَرِيعٌ جِدًّا.", translation: "Kereta itu sangat cepat." },
    ],
  },
  {
    id: "teman",
    title: "Teman-temanku",
    hint: "sahabat, kelas, bermain",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "لِي صَدِيقٌ اسْمُهُ أَحْمَدُ.", translation: "Saya punya teman bernama Ahmad." },
      { id: "s2", arabic: "نَحْنُ نَلْعَبُ مَعًا بَعْدَ الدِّرَاسَةِ.", translation: "Kami bermain bersama setelah belajar." },
      { id: "s3", arabic: "صَدِيقَتِي طَيِّبَةٌ وَمُجْتَهِدَةٌ.", translation: "Sahabat perempuan saya baik dan rajin." },
    ],
  },
  {
    id: "ruang-kelas",
    title: "Di Ruang Kelas",
    hint: "belajar, guru, papan tulis",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "الْمُعَلِّمُ يَكْتُبُ عَلَى السَّبُّورَةِ.", translation: "Guru menulis di papan tulis." },
      { id: "s2", arabic: "الطُّلَّابُ يَسْتَمِعُونَ بِهُدُوءٍ.", translation: "Para murid mendengarkan dengan tenang." },
      { id: "s3", arabic: "أَنَا أَفْتَحُ كِتَابِي الْآنَ.", translation: "Saya membuka buku saya sekarang." },
    ],
  },
  {
    id: "negaraku",
    title: "Negaraku",
    hint: "Indonesia, bendera, ibu kota",
    level: "menengah",
    sentences: [
      { id: "s1", arabic: "أَنَا مِنْ إِنْدُونِيسِيَا.", translation: "Saya berasal dari Indonesia." },
      { id: "s2", arabic: "جَاكَرْتَا هِيَ عَاصِمَةُ بِلَادِي.", translation: "Jakarta adalah ibu kota negara saya." },
      { id: "s3", arabic: "عَلَمُ بِلَادِي أَحْمَرُ وَأَبْيَضُ.", translation: "Bendera negara saya merah dan putih." },
    ],
  },
  {
    id: "hari-seminggu",
    title: "Hari dalam Seminggu",
    hint: "Senin sampai Minggu",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "يَوْمُ الْجُمُعَةِ يَوْمٌ مُبَارَكٌ.", translation: "Hari Jumat adalah hari yang penuh berkah." },
      { id: "s2", arabic: "أَنَا أَذْهَبُ إِلَى السُّوقِ يَوْمَ السَّبْتِ.", translation: "Saya pergi ke pasar pada hari Sabtu." },
      { id: "s3", arabic: "الْأُسْبُوعُ فِيهِ سَبْعَةُ أَيَّامٍ.", translation: "Satu minggu terdiri dari tujuh hari." },
    ],
  },
  {
    id: "bulan-setahun",
    title: "Bulan dalam Setahun",
    hint: "Ramadhan, Syawal",
    level: "menengah",
    sentences: [
      { id: "s1", arabic: "شَهْرُ رَمَضَانَ شَهْرُ الصِّيَامِ.", translation: "Bulan Ramadhan adalah bulan puasa." },
      { id: "s2", arabic: "السَّنَةُ فِيهَا اثْنَا عَشَرَ شَهْرًا.", translation: "Satu tahun terdiri dari dua belas bulan." },
      { id: "s3", arabic: "أُحِبُّ شَهْرَ شَوَّالٍ كَثِيرًا.", translation: "Saya sangat menyukai bulan Syawal." },
    ],
  },
  {
    id: "kamar-tidur",
    title: "Kamar Tidurku",
    hint: "tempat tidur, lemari",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "غُرْفَتِي صَغِيرَةٌ وَنَظِيفَةٌ.", translation: "Kamar saya kecil dan bersih." },
      { id: "s2", arabic: "سَرِيرِي بِجَانِبِ النَّافِذَةِ.", translation: "Tempat tidur saya di samping jendela." },
      { id: "s3", arabic: "أُرَتِّبُ غُرْفَتِي كُلَّ صَبَاحٍ.", translation: "Saya merapikan kamar setiap pagi." },
    ],
  },
  {
    id: "mainan",
    title: "Mainan Kesukaan",
    hint: "bola, boneka, mobil mainan",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "أَخِي يُحِبُّ الْكُرَةَ كَثِيرًا.", translation: "Adik laki-laki saya sangat suka bola." },
      { id: "s2", arabic: "أُخْتِي تَلْعَبُ بِالدُّمْيَةِ.", translation: "Adik perempuan saya bermain boneka." },
      { id: "s3", arabic: "لَعِبِي الْمُفَضَّلُ سَيَّارَةٌ صَغِيرَةٌ.", translation: "Mainan favorit saya adalah mobil kecil." },
    ],
  },
  {
    id: "ke-taman",
    title: "Ke Taman",
    hint: "jalan-jalan, bermain, pohon",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "نَذْهَبُ إِلَى الْحَدِيقَةِ فِي عُطْلَةِ الْأُسْبُوعِ.", translation: "Kami pergi ke taman saat akhir pekan." },
      { id: "s2", arabic: "فِي الْحَدِيقَةِ أَشْجَارٌ كَثِيرَةٌ.", translation: "Di taman ada banyak pohon." },
      { id: "s3", arabic: "الْأَطْفَالُ يَلْعَبُونَ وَيَضْحَكُونَ.", translation: "Anak-anak bermain dan tertawa." },
    ],
  },
  {
    id: "olahraga",
    title: "Olahraga yang Kusuka",
    hint: "sepak bola, renang",
    level: "menengah",
    sentences: [
      { id: "s1", arabic: "أُحِبُّ كُرَةَ الْقَدَمِ كَثِيرًا.", translation: "Saya sangat menyukai sepak bola." },
      { id: "s2", arabic: "أَنَا أَسْبَحُ فِي عُطْلَةِ الصَّيْفِ.", translation: "Saya berenang saat liburan musim panas." },
      { id: "s3", arabic: "الرِّيَاضَةُ تُقَوِّي الْجِسْمَ.", translation: "Olahraga membuat tubuh menjadi kuat." },
    ],
  },
  {
    id: "sekolahku",
    title: "Sekolahku",
    hint: "kelas, guru, teman",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "مَدْرَسَتِي قَرِيبَةٌ مِنْ بَيْتِي.", translation: "Sekolah saya dekat dari rumah." },
      { id: "s2", arabic: "أُحِبُّ مُعَلِّمِي وَأَصْدِقَائِي.", translation: "Saya menyukai guru dan teman-teman saya." },
      { id: "s3", arabic: "الدِّرَاسَةُ تَبْدَأُ فِي السَّاعَةِ السَّابِعَةِ.", translation: "Pelajaran dimulai pukul tujuh." },
    ],
  },
  {
    id: "sarapan",
    title: "Sarapan Pagi",
    hint: "roti, telur, susu",
    level: "pemula",
    sentences: [
      { id: "s1", arabic: "أَتَنَاوَلُ الْفُطُورَ فِي السَّاعَةِ السَّادِسَةِ.", translation: "Saya sarapan pukul enam." },
      { id: "s2", arabic: "أُمِّي تُحَضِّرُ الْخُبْزَ وَالْبَيْضَ.", translation: "Ibu saya menyiapkan roti dan telur." },
      { id: "s3", arabic: "أَشْرَبُ كَأْسًا مِنَ الْحَلِيبِ كُلَّ صَبَاحٍ.", translation: "Saya minum segelas susu setiap pagi." },
    ],
  },
];
