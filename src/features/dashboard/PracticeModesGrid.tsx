import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SCENARIOS } from "@/data/scenarios";
import { DIFFICULTY_LABEL, type Difficulty } from "@/types/conversation";
import { cn } from "@/lib/utils";

const DIFFICULTY_DOT: Record<Difficulty, string> = {
  pemula: "bg-success",
  menengah: "bg-accent",
  lanjutan: "bg-danger",
};

/**
 * Deliberately the one section on the page with no filled background and
 * no rounded container — every other section is a tinted box, so this
 * reads as a clean editorial list instead of one more repeated card.
 */
export function PracticeModesGrid() {
  const navigate = useNavigate();

  return (
    <section>
      <p className="mb-1 text-[13px] font-semibold text-muted-foreground">Jelajahi Skenario</p>
      <div className="divide-y divide-border">
        {SCENARIOS.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025, duration: 0.2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/bicara-ai?scenario=${scenario.id}`)}
            className="flex w-full items-center gap-4 py-4 text-left transition-opacity hover:opacity-70"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {scenario.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-foreground">{scenario.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                {scenario.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", DIFFICULTY_DOT[scenario.difficulty])} />
                {DIFFICULTY_LABEL[scenario.difficulty]}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3 w-3" /> {scenario.estimatedMinutes} menit
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
