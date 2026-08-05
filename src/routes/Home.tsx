import { ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingDialog } from "@/components/domain/OnboardingDialog";
import { HomeHero } from "@/features/dashboard/HomeHero";
import { TodayPracticeHero } from "@/features/dashboard/TodayPracticeHero";
import { StartSpeakingButton } from "@/features/dashboard/StartSpeakingButton";
import { ArabicOfTheDay } from "@/features/dashboard/ArabicOfTheDay";
import { WeeklyActivitySection } from "@/features/dashboard/WeeklyActivitySection";
import { LearningHubSection } from "@/features/dashboard/LearningHubSection";
import { PracticeModesGrid } from "@/features/dashboard/PracticeModesGrid";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/store/useAppStore";

const KIND_LABEL: Record<string, string> = {
  kosakata: "Kosakata",
  kalimat: "Kalimat",
  percakapan: "Percakapan",
  quran: "Al-Quran",
  umrah: "Panduan Umrah",
  haji: "Panduan Haji",
};

export function Home() {
  const navigate = useNavigate();
  const legacyHistory = useAppStore((state) => state.history);
  const clearLegacyHistory = useAppStore((state) => state.clearHistory);

  return (
    <AppShell>
      <OnboardingDialog />

      <HomeHero />

      <TodayPracticeHero />
      <StartSpeakingButton />

      <div className="mt-12 space-y-10">
        <ArabicOfTheDay />
        <WeeklyActivitySection />
        <LearningHubSection />
        <PracticeModesGrid />
      </div>

      <button
        type="button"
        onClick={() => navigate("/pilih-mode")}
        className="mt-8 flex w-full items-center justify-center gap-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Kosakata, Kalimat &amp; Al-Quran <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {legacyHistory.length > 0 && (
        <div className="mt-8">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Riwayat Latihan Lain
            </p>
            <button
              type="button"
              onClick={clearLegacyHistory}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-danger"
            >
              <Trash2 className="h-3 w-3" /> Hapus
            </button>
          </div>
          <div className="divide-y divide-border">
            {legacyHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{entry.topicTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {KIND_LABEL[entry.kind]} ·{" "}
                    {new Date(entry.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </p>
                </div>
                {entry.total !== undefined && (
                  <span className="shrink-0 text-sm font-bold text-primary">
                    {entry.score}/{entry.total}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
