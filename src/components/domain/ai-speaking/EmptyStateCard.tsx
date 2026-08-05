import { Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AudioButton } from "@/components/domain/AudioButton";
import { TutorIdentity } from "./TutorIdentity";
import { SCENARIOS } from "@/data/scenarios";
import type { Scenario } from "@/types/conversation";

interface EmptyStateCardProps {
  onPickScenario: (scenario: Scenario) => void;
}

const EXAMPLE_PHRASES = [
  { arabic: "مَرْحَبًا، كَيْفَ حَالُكَ؟", translation: "Halo, apa kabar?" },
  { arabic: "أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ.", translation: "Aku mau belajar Bahasa Arab." },
];

const RECOMMENDED_SCENARIO_ID = "daily";

export function EmptyStateCard({ onPickScenario }: EmptyStateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-raised">
          <Sparkles className="h-7 w-7" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight text-foreground">Arabic Speaking Coach</p>
          <p className="text-sm font-medium text-primary">Berlatih bicara Bahasa Arab secara alami.</p>
        </div>
      </div>

      <Card className="p-5">
        <TutorIdentity size="lg" />
        <div className="mt-4 space-y-2 rounded-md bg-surface-muted p-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contoh frasa
          </p>
          {EXAMPLE_PHRASES.map((phrase) => (
            <div key={phrase.arabic} className="flex items-center justify-between gap-2">
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
      </Card>

      <div>
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pilih skenario untuk mulai
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SCENARIOS.map((scenario, i) => {
            const isRecommended = scenario.id === RECOMMENDED_SCENARIO_ID;
            return (
              <motion.button
                key={scenario.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPickScenario(scenario)}
                className="relative flex flex-col items-start gap-1 rounded-md border border-border bg-surface p-3.5 text-left shadow-resting transition-colors hover:border-primary/40 hover:bg-primary-muted hover:shadow-raised"
              >
                {isRecommended && (
                  <span className="absolute -top-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground shadow-resting">
                    <Star className="h-2.5 w-2.5 fill-current" /> Mulai di sini
                  </span>
                )}
                <span className="text-xl" aria-hidden="true">
                  {scenario.icon}
                </span>
                <span className="text-sm font-bold text-foreground">{scenario.title}</span>
                <span className="text-xs leading-snug text-muted-foreground">{scenario.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
