import { BookA, MessageCircle, MessagesSquare, BookOpen, Compass, MapPin, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";

interface Mode {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  path: string;
}

const modes: Mode[] = [
  {
    id: "kosakata",
    title: "Kosakata",
    description: "Pilih topik kosakata Arab, tebak arti, dan latih pengucapan kata per kata",
    icon: BookA,
    iconClass: "bg-amber-100 text-amber-600",
    path: "/kosakata/setup",
  },
  {
    id: "kalimat",
    title: "Kalimat",
    description: "Latihan pengucapan kalimat dengan topik pilihan atau teks sendiri",
    icon: MessageCircle,
    iconClass: "bg-indigo-100 text-indigo-600",
    path: "/kalimat/setup",
  },
  {
    id: "percakapan",
    title: "Percakapan",
    description: "Latihan dialog dua orang dalam berbagai situasi sehari-hari",
    icon: MessagesSquare,
    iconClass: "bg-pink-100 text-pink-600",
    path: "/percakapan/setup",
  },
  {
    id: "quran",
    title: "Baca Al-Quran",
    description: "Telusuri 114 surah lengkap dengan terjemahan Indonesia",
    icon: BookOpen,
    iconClass: "bg-emerald-100 text-emerald-600",
    path: "/quran",
  },
  {
    id: "umrah",
    title: "Panduan Umrah",
    description: "Rukun, sunnah, tahapan, dan doa seputar umrah",
    icon: Compass,
    iconClass: "bg-sky-100 text-sky-600",
    path: "/panduan/umrah",
  },
  {
    id: "haji",
    title: "Panduan Haji",
    description: "Rukun, tahapan, dan doa seputar ibadah haji",
    icon: MapPin,
    iconClass: "bg-purple-100 text-purple-600",
    path: "/panduan/haji",
  },
];

export function ModeSelect() {
  const navigate = useNavigate();
  return (
    <PageShell>
      <SessionHeader title="Pilih Jenis Latihan" onBack={() => navigate("/")} />
      <p className="mb-5 text-center text-sm text-slate-500">Mau latihan apa hari ini?</p>
      <div className="space-y-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => navigate(mode.path)}
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${mode.iconClass}`}>
              <mode.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800">{mode.title}</p>
              <p className="text-xs text-slate-500">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}
