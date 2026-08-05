import {
  BookA,
  MessageCircle,
  MessagesSquare,
  BookOpen,
  Compass,
  MapPin,
  NotebookText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";

interface Mode {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "danger";
  path: string;
}

const TONE_CLASS: Record<Mode["tone"], string> = {
  primary: "bg-primary-muted text-primary",
  accent: "bg-accent-muted text-accent-foreground",
  success: "bg-success-muted text-success",
  danger: "bg-role-a/15 text-role-a",
};

const modes: Mode[] = [
  {
    id: "bicara-ai",
    title: "Latihan Bicara AI",
    description: "Ngobrol bebas dalam Bahasa Arab dengan lawan bicara AI secara real-time",
    icon: Sparkles,
    tone: "primary",
    path: "/bicara-ai",
  },
  {
    id: "buku-belajar",
    title: "Buku Belajar",
    description: "Kosakata dan ungkapan tersimpan, riwayat percakapan, dan sesi ulasan",
    icon: NotebookText,
    tone: "success",
    path: "/buku-belajar",
  },
  {
    id: "kosakata",
    title: "Kosakata",
    description: "Pilih topik kosakata Arab, tebak arti, dan latih pengucapan kata per kata",
    icon: BookA,
    tone: "accent",
    path: "/kosakata/setup",
  },
  {
    id: "kalimat",
    title: "Kalimat",
    description: "Latihan pengucapan kalimat dengan topik pilihan atau teks sendiri",
    icon: MessageCircle,
    tone: "primary",
    path: "/kalimat/setup",
  },
  {
    id: "percakapan",
    title: "Percakapan",
    description: "Latihan dialog dua orang dalam berbagai situasi sehari-hari",
    icon: MessagesSquare,
    tone: "danger",
    path: "/percakapan/setup",
  },
  {
    id: "quran",
    title: "Baca Al-Quran",
    description: "Telusuri 114 surah lengkap dengan terjemahan Indonesia",
    icon: BookOpen,
    tone: "success",
    path: "/quran",
  },
  {
    id: "umrah",
    title: "Panduan Umrah",
    description: "Rukun, sunnah, tahapan, dan doa seputar umrah",
    icon: Compass,
    tone: "primary",
    path: "/panduan/umrah",
  },
  {
    id: "haji",
    title: "Panduan Haji",
    description: "Rukun, tahapan, dan doa seputar ibadah haji",
    icon: MapPin,
    tone: "accent",
    path: "/panduan/haji",
  },
];

export function ModeSelect() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <TopBar title="Pilih Jenis Latihan" onBack={() => navigate("/")} />
      <p className="mb-5 text-center text-sm text-muted-foreground">Mau latihan apa hari ini?</p>
      <div className="space-y-3">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
          >
            <Card
              className="cursor-pointer p-4 transition-transform hover:-translate-y-0.5 hover:shadow-raised"
              onClick={() => navigate(mode.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(mode.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${TONE_CLASS[mode.tone]}`}>
                  <mode.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">{mode.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{mode.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
