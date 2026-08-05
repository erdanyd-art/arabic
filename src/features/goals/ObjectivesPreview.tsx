import { Target } from "lucide-react";
import type { Scenario } from "@/types/conversation";

/** One-line "N tujuan" hint on scenario picker rows (EmptyStateCard) so goals are visible before a session even starts. */
export function ObjectivesPreview({ scenario }: { scenario: Scenario }) {
  if (scenario.objectives.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1">
      <Target className="h-3 w-3" /> {scenario.objectives.length} tujuan
    </span>
  );
}
