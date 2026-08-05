import { useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TUTOR_NAME } from "@/prompts/persona";
import { useAppStore } from "@/store/useAppStore";
import { useTodayScenario } from "./useTodayScenario";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

const TUTOR_LINES = [
  "Aku akan bantu kamu bicara senatural mungkin.",
  "Hari ini aku cuma akan balas pakai Bahasa Arab — biar kamu terbiasa.",
  "Santai saja, salah itu bagian dari belajar.",
];

/**
 * The opener — no card, no border, just typography and one moment of
 * tutor warmth. Carries today's scenario in prose (TodayPracticeHero
 * repeats it visually as the mission, which is intentional: tell it
 * casually here, show it formally there).
 */
export function HomeHero() {
  const userName = useAppStore((s) => s.userName);
  const { scenario } = useTodayScenario();
  const [tutorLine] = useState(() => TUTOR_LINES[Math.floor(Math.random() * TUTOR_LINES.length)]);

  return (
    <div className="mb-9">
      <div className="flex items-start justify-between gap-3">
        <p lang="ar" dir="rtl" className="font-arabic text-xl text-muted-foreground">
          السلام عليكم 👋
        </p>
        <ThemeToggle />
      </div>

      <h1 className="mt-1 text-[28px] font-extrabold leading-[1.15] tracking-tight text-foreground">
        {getGreeting()}
        {userName ? `, ${userName}.` : "."}
      </h1>

      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        Hari ini kita latihan <span className="font-semibold text-foreground">{scenario.title.toLowerCase()}</span> —
        cuma {scenario.estimatedMinutes} menit.
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-accent-muted text-xs font-bold text-accent-foreground">
            {TUTOR_NAME[0]}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm italic text-muted-foreground">"{tutorLine}" — {TUTOR_NAME}</p>
      </div>
    </div>
  );
}
