import type { GuideSection } from "@/lib/types";

export const umrahGuide: GuideSection[] = [
  {
    id: "rukun",
    title: "Rukun Umrah",
    steps: [
      { id: "r1", title: "Ihram", description: "Berniat umrah dari miqat dan mengenakan pakaian ihram." },
      { id: "r2", title: "Tawaf", description: "Mengelilingi Ka'bah sebanyak tujuh putaran." },
      { id: "r3", title: "Sa'i", description: "Berjalan bolak-balik antara bukit Safa dan Marwah sebanyak tujuh kali." },
      { id: "r4", title: "Tahallul", description: "Mencukur atau memendekkan rambut sebagai tanda selesainya ihram." },
    ],
  },
  {
    id: "sunnah",
    title: "Sunnah Umrah",
    steps: [
      { id: "s1", title: "Mandi sebelum ihram", description: "Disunnahkan mandi besar sebelum mengenakan pakaian ihram." },
      { id: "s2", title: "Memperbanyak talbiyah", description: "Mengucapkan talbiyah berulang-ulang sejak ihram hingga mulai tawaf." },
      { id: "s3", title: "Mencium Hajar Aswad", description: "Bila memungkinkan, mencium atau mengusap Hajar Aswad saat tawaf." },
    ],
  },
  {
    id: "doa",
    title: "Doa & Talbiyah",
    steps: [
      {
        id: "d1",
        title: "Talbiyah",
        description: "Diucapkan berulang sejak niat ihram.",
        dua: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ",
        duaTranslation: "Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu.",
      },
      {
        id: "d2",
        title: "Doa memasuki Masjidil Haram",
        description: "Dibaca ketika memasuki area Masjidil Haram.",
        dua: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        duaTranslation: "Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu.",
      },
    ],
  },
];

export const hajiGuide: GuideSection[] = [
  {
    id: "rukun",
    title: "Rukun Haji",
    steps: [
      { id: "r1", title: "Ihram", description: "Berniat haji dari miqat dan mengenakan pakaian ihram." },
      { id: "r2", title: "Wukuf di Arafah", description: "Berdiam diri di Arafah pada tanggal 9 Dzulhijjah." },
      { id: "r3", title: "Tawaf Ifadah", description: "Mengelilingi Ka'bah setelah wukuf sebagai rukun utama haji." },
      { id: "r4", title: "Sa'i", description: "Berjalan bolak-balik antara Safa dan Marwah tujuh kali." },
      { id: "r5", title: "Tahallul", description: "Mencukur atau memendekkan rambut setelah rangkaian ibadah selesai." },
      { id: "r6", title: "Tertib", description: "Melaksanakan rukun-rukun haji sesuai urutannya." },
    ],
  },
  {
    id: "tahapan",
    title: "Tahapan Umum",
    steps: [
      { id: "t1", title: "8 Dzulhijjah — Tarwiyah", description: "Menuju Mina dan bermalam di sana." },
      { id: "t2", title: "9 Dzulhijjah — Arafah", description: "Wukuf di Arafah dari zawal hingga terbenam matahari." },
      { id: "t3", title: "9-10 Dzulhijjah — Muzdalifah", description: "Bermalam di Muzdalifah, mengambil kerikil untuk melempar jumrah." },
      { id: "t4", title: "10 Dzulhijjah — Mina", description: "Melempar jumrah Aqabah, menyembelih hadyu, lalu tahallul." },
    ],
  },
  {
    id: "doa",
    title: "Doa Utama",
    steps: [
      {
        id: "d1",
        title: "Doa di Arafah",
        description: "Diperbanyak sepanjang waktu wukuf.",
        dua: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        duaTranslation: "Tiada Tuhan selain Allah, Yang Maha Esa, tiada sekutu bagi-Nya.",
      },
    ],
  },
];
