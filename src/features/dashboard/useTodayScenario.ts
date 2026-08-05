import { SCENARIOS } from "@/data/scenarios";
import { useAppStore } from "@/store/useAppStore";

const DEFAULT_SCENARIO_ID = "daily";

/** Single source of truth for "today's" scenario — shared by TodayPracticeHero and StartSpeakingButton so they never disagree about which scenario the CTA deep-links to. */
export function useTodayScenario() {
  const lastAiScenarioId = useAppStore((s) => s.lastAiScenarioId);
  const scenario =
    SCENARIOS.find((s) => s.id === lastAiScenarioId) ??
    SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO_ID) ??
    SCENARIOS[0];
  return { scenario, isSuggested: !lastAiScenarioId };
}
