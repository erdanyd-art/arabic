import { ArrowRight, Clock3, Lightbulb, MessageCircle, PartyPopper, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getScenario } from "@/data/scenarios";
import { formatDuration } from "@/lib/date";
import type { ConversationHistoryEntry } from "@/types/learning";
import { SummaryStatRow } from "./SummaryStatRow";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

interface SessionSummaryViewProps {
  entry: ConversationHistoryEntry;
}

/** The "beautiful, encouraging" post-session summary — deliberately reads like a coach's recap, not a report card: no scores, gentle framing on what to improve, always leads with what went well. */
export function SessionSummaryView({ entry }: SessionSummaryViewProps) {
  const navigate = useNavigate();
  const { summary } = entry;
  const scenario = getScenario(entry.scenarioId);
  const nextScenario = getScenario(summary.suggestedNextScenarioId);

  return (
    <div className="flex flex-1 flex-col gap-7">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted">
          <PartyPopper className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-3 text-lg font-bold text-foreground">Kerja bagus hari ini.</p>
        <p className="text-sm text-muted-foreground">
          {scenario.icon} {entry.scenarioTitle}
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ delay: 0.08, duration: 0.3 }}
        className="grid grid-cols-4 gap-2"
      >
        <SummaryStatRow icon={Clock3} value={formatDuration(entry.durationSeconds)} label="Durasi" />
        <SummaryStatRow icon={MessageCircle} value={String(entry.messageCount)} label="Pesan" />
        <SummaryStatRow icon={Sparkles} value={String(summary.vocabularyLearned.length)} label="Kosakata" />
        <SummaryStatRow icon={Target} value={`${entry.objectivesCompleted.length}/${entry.objectivesTotal}`} label="Tujuan" />
      </motion.div>

      {summary.vocabularyLearned.length > 0 && (
        <motion.section {...fadeUp} transition={{ delay: 0.14, duration: 0.3 }}>
          <p className="mb-2 text-[13px] font-semibold text-muted-foreground">Kosakata yang dipelajari</p>
          <div className="flex flex-wrap gap-1.5">
            {summary.vocabularyLearned.map((word) => (
              <span
                key={word.word}
                className="rounded-full bg-surface-muted px-3 py-1.5 text-xs text-foreground"
              >
                <span lang="ar" className="font-arabic">
                  {word.word}
                </span>{" "}
                <span className="text-muted-foreground">— {word.meaning}</span>
              </span>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section {...fadeUp} transition={{ delay: 0.2, duration: 0.3 }}>
        <p className="mb-2 text-[13px] font-semibold text-muted-foreground">Yang sudah bagus</p>
        <ul className="space-y-1.5">
          {summary.strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              {strength}
            </li>
          ))}
        </ul>
      </motion.section>

      {summary.areasForImprovement.length > 0 && (
        <motion.section {...fadeUp} transition={{ delay: 0.26, duration: 0.3 }}>
          <p className="mb-2 text-[13px] font-semibold text-muted-foreground">Yang bisa ditingkatkan</p>
          <ul className="space-y-1.5">
            {summary.areasForImprovement.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                {area}
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <motion.section
        {...fadeUp}
        transition={{ delay: 0.32, duration: 0.3 }}
        className="rounded-xl bg-primary-muted/40 p-4"
      >
        <p className="text-[13px] font-semibold text-muted-foreground">Lanjut latihan</p>
        <button
          type="button"
          onClick={() => navigate(`/bicara-ai?scenario=${nextScenario.id}`)}
          className="mt-2 flex w-full items-center gap-3 text-left"
        >
          <span className="text-xl" aria-hidden="true">
            {nextScenario.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{nextScenario.title}</p>
            <p className="truncate text-xs text-muted-foreground">{nextScenario.description}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </motion.section>

      <motion.div {...fadeUp} transition={{ delay: 0.38, duration: 0.3 }} className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(`/riwayat/${entry.id}?tab=transkrip`)}>
          Lihat Transkrip
        </Button>
        <Button className="flex-1" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
      </motion.div>
    </div>
  );
}
