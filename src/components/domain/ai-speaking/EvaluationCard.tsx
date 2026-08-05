import { useState, type ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Evaluation, ScenarioCategory } from "@/types/conversation";
import { cn } from "@/lib/utils";
import { VocabularySaveButton } from "@/features/vocabulary/VocabularySaveButton";

interface EvaluationCardProps {
  evaluation: Evaluation;
  /** The user's sentence this evaluation belongs to — used as the saved example sentence when bookmarking a vocabulary word. */
  example: string;
  scenarioId: ScenarioCategory;
}

/**
 * Per-message learning feedback — the core of the "practicing with a
 * tutor" feeling. Each section below is one evaluator; adding a future
 * one (pronunciation, CEFR estimate, speaking confidence, …) means
 * adding a field to the `Evaluation` type and one more `<Section>` here,
 * nothing else changes.
 */
export function EvaluationCard({ evaluation, example, scenarioId }: EvaluationCardProps) {
  const [open, setOpen] = useState(false);
  const hasNaturalRewrite = Boolean(evaluation.natural.rewrite?.trim());

  return (
    <div className="mt-1 w-full max-w-[78%]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-3 w-3" />
        {open ? "Sembunyikan evaluasi" : "Lihat evaluasi"}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 divide-y divide-border border-y border-border py-1 text-xs">
              <Section label="Tata bahasa" ok={evaluation.grammar.correct}>
                {evaluation.grammar.note}
              </Section>

              <Section label="Ungkapan natural" ok={!hasNaturalRewrite}>
                {hasNaturalRewrite && (
                  <p lang="ar" dir="rtl" className="font-arabic mb-1 text-left text-sm text-foreground">
                    {evaluation.natural.rewrite}
                  </p>
                )}
                {evaluation.natural.note}
              </Section>

              {evaluation.vocabulary.length > 0 && (
                <Section label="Kosakata">
                  <ul className="space-y-1">
                    {evaluation.vocabulary.map((v) => (
                      <li key={v.word} className="flex items-center justify-between gap-2">
                        <span>
                          <span lang="ar" className="font-arabic text-foreground">
                            {v.word}
                          </span>{" "}
                          — {v.meaning}
                        </span>
                        <VocabularySaveButton word={v} example={example} scenarioId={scenarioId} />
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section label="Kelancaran">{evaluation.fluency.note}</Section>

              <Section label="Saran berikutnya">{evaluation.suggestion}</Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  label,
  ok,
  children,
}: {
  label: string;
  ok?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="px-1 py-2 first:pt-0.5 last:pb-0.5">
      <p className="mb-0.5 flex items-center gap-1.5 font-semibold text-foreground">
        {ok !== undefined && (
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", ok ? "bg-success" : "bg-accent")} />
        )}
        {label}
      </p>
      <div className="leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
