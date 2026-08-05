import type { Scenario } from "@/types/conversation";

export const SCENARIOS: Scenario[] = [
  {
    id: "daily",
    title: "Percakapan Harian",
    description: "Obrolan santai tentang kegiatan sehari-hari",
    icon: "💬",
  },
  {
    id: "restaurant",
    title: "Restoran",
    description: "Pesan makanan dan minuman ala pengunjung restoran",
    icon: "🍽️",
  },
  {
    id: "shopping",
    title: "Berbelanja",
    description: "Tawar-menawar dan tanya harga di toko atau pasar",
    icon: "🛍️",
  },
  {
    id: "airport",
    title: "Bandara",
    description: "Check-in, imigrasi, dan tanya arah di bandara",
    icon: "✈️",
  },
  {
    id: "hotel",
    title: "Hotel",
    description: "Check-in, minta bantuan, dan keluhan ke resepsionis",
    icon: "🏨",
  },
  {
    id: "classroom",
    title: "Di Kelas",
    description: "Tanya jawab dengan guru dan diskusi pelajaran",
    icon: "🎓",
  },
  {
    id: "interview",
    title: "Wawancara Kerja",
    description: "Simulasi tanya jawab wawancara kerja sederhana",
    icon: "💼",
  },
  {
    id: "friends",
    title: "Ketemu Teman",
    description: "Janjian dan ngobrol santai dengan teman",
    icon: "🤝",
  },
];
