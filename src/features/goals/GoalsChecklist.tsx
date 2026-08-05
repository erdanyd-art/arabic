import { Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Scenario } from "@/types/conversation";

interface GoalsChecklistProps {
  scenario: Scenario;
  completedIds: Set<string>;
}

/** Collapsed-by-default checklist of the active scenario's learning goals — progress updates live as `completedIds` grows each turn (see useSessionGoals). */
export function GoalsChecklist({ scenario, completedIds }: GoalsChecklistProps) {
  if (scenario.objectives.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="rounded-lg border border-border bg-surface">
      <AccordionItem value="goals" className="border-none">
        <AccordionTrigger className="px-3.5 py-2.5 text-xs">
          <span className="flex items-center gap-2">
            Tujuan latihan
            <span className="font-normal text-muted-foreground">
              {completedIds.size}/{scenario.objectives.length}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3.5 pb-3 pt-0">
          <ul className="space-y-2">
            {scenario.objectives.map((objective) => {
              const done = completedIds.has(objective.id);
              return (
                <li key={objective.id} className="flex items-center gap-2 text-xs">
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                      </motion.span>
                    ) : (
                      <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </AnimatePresence>
                  <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>{objective.label}</span>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
