import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { AudioButton } from "@/components/domain/AudioButton";
import { TutorIdentity } from "./TutorIdentity";
import { SCENARIOS } from "@/data/scenarios";
import { DIFFICULTY_LABEL, type Scenario } from "@/types/conversation";
import { ObjectivesPreview } from "@/features/goals/ObjectivesPreview";

interface EmptyStateCardProps {
  onPickScenario: (scenario: Scenario) => void;
}

const EXAMPLE_PHRASES = [
  { arabic: "مَرْحَبًا، كَيْفَ حَالُكَ؟", translation: "Halo, apa kabar?" },
  { arabic: "أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ.", translation: "Aku mau belajar Bahasa Arab." },
];

export function EmptyStateCard({ onPickScenario }: EmptyStateCardProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="pb-6 pt-1 text-center">
        <p className="text-lg font-bold tracking-tight text-foreground">Arabic Speaking Coach</p>
        <p className="mt-1 text-sm text-muted-foreground">Berlatih bicara Bahasa Arab secara alami.</p>
      </div>

      <TutorIdentity size="lg" />

      <div className="mt-5 space-y-2">
        <p className="text-[13px] font-semibold text-muted-foreground">Contoh frasa</p>
        {EXAMPLE_PHRASES.map((phrase) => (
          <div key={phrase.arabic} className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-0">
            <div className="min-w-0">
              <p lang="ar" className="font-arabic text-lg text-foreground">
                {phrase.arabic}
              </p>
              <p className="text-xs text-muted-foreground">{phrase.translation}</p>
            </div>
            <AudioButton text={phrase.arabic} size="sm" />
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="mb-3 text-[13px] font-semibold text-muted-foreground">Pilih skenario untuk mulai</p>
        <div className="divide-y divide-border border-y border-border">
          {SCENARIOS.map((scenario, i) => (
            <motion.button
              key={scenario.id}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              onClick={() => onPickScenario(scenario)}
              className="flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-surface-muted"
            >
              <span className="text-xl" aria-hidden="true">
                {scenario.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{scenario.title}</p>
                <p className="truncate text-xs text-muted-foreground">{scenario.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5 text-[11px] text-muted-foreground">
                <span>{DIFFICULTY_LABEL[scenario.difficulty]}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3 w-3" /> {scenario.estimatedMinutes} mnt
                </span>
                <ObjectivesPreview scenario={scenario} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
