import { SCENARIOS } from "@/data/scenarios";
import type { ChatMessage, Evaluation, Scenario, ScenarioCategory, VocabularyNote } from "@/types/conversation";
import type { SessionSummary } from "@/types/learning";

// Pure, deterministic, zero AI calls — everything here derives from the
// per-turn `Evaluation` objects already generated live during the session
// (grammar/natural/vocabulary/fluency, see prompts/evaluation.ts) plus
// SCENARIOS data. Kept side-effect-free so it's independently testable
// even though this repo has no test runner yet.

interface ComputeSessionSummaryInput {
  scenario: Scenario;
  messages: ChatMessage[];
  durationSeconds: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  /** Scenario ids from the most recent completed sessions, newest-first — must be read BEFORE the current session is written to HistoryStorage, or it would count against its own suggestion. */
  recentScenarioIds: ScenarioCategory[];
}

function collectEvaluations(messages: ChatMessage[]): Evaluation[] {
  return messages
    .filter((m) => m.role === "user" && !m.failed && m.evaluation)
    .map((m) => m.evaluation as Evaluation);
}

function dedupeVocabulary(evaluations: Evaluation[]): VocabularyNote[] {
  const byWord = new Map<string, VocabularyNote>();
  for (const evaluation of evaluations) {
    for (const word of evaluation.vocabulary) byWord.set(word.word, word);
  }
  return [...byWord.values()];
}

function computeGrammarObservations(evaluations: Evaluation[]): string[] {
  const issues = evaluations.filter((e) => !e.grammar.correct).map((e) => e.grammar.note);
  if (issues.length > 0) return issues.slice(0, 3);
  if (evaluations.length > 0) {
    return [`Semua ${evaluations.length} kalimat yang dinilai sudah benar secara tata bahasa.`];
  }
  return [];
}

function computeStrengths(evaluations: Evaluation[], objectivesCompleted: number, objectivesTotal: number): string[] {
  const strengths: string[] = [];
  const n = evaluations.length;

  if (n > 0) {
    const grammarRatio = evaluations.filter((e) => e.grammar.correct).length / n;
    const naturalRatio = evaluations.filter((e) => !e.natural.rewrite?.trim()).length / n;
    const vocabCount = dedupeVocabulary(evaluations).length;

    if (grammarRatio >= 0.7) {
      strengths.push(`Tata bahasa cukup kuat — ${Math.round(grammarRatio * 100)}% kalimat sudah benar.`);
    }
    if (naturalRatio >= 0.6) {
      strengths.push("Cara bicaramu sudah terdengar cukup natural bagi penutur asli.");
    }
    if (vocabCount >= 5) {
      strengths.push(`Berhasil memakai ${vocabCount} kosakata berbeda dalam satu sesi.`);
    }
  }

  if (objectivesTotal > 0 && objectivesCompleted === objectivesTotal) {
    strengths.push("Semua tujuan latihan di skenario ini tercapai!");
  }

  if (strengths.length === 0) {
    strengths.push("Kamu sudah berani mencoba bicara Bahasa Arab — itu langkah paling penting.");
  }

  return strengths.slice(0, 3);
}

function computeAreasForImprovement(
  evaluations: Evaluation[],
  objectivesCompleted: number,
  objectivesTotal: number,
): string[] {
  const areas: string[] = [];
  const n = evaluations.length;

  if (n > 0) {
    const grammarRatio = evaluations.filter((e) => e.grammar.correct).length / n;
    const naturalRatio = evaluations.filter((e) => !e.natural.rewrite?.trim()).length / n;
    if (grammarRatio < 0.7) areas.push("Coba lebih perhatikan struktur tata bahasa sebelum bicara.");
    if (areas.length < 2 && naturalRatio < 0.6) {
      areas.push("Latih ungkapan yang lebih natural — cek lagi versi perbaikan di setiap evaluasi.");
    }
  }

  if (areas.length < 2 && objectivesTotal > 0 && objectivesCompleted < objectivesTotal) {
    areas.push("Masih ada tujuan latihan yang belum tercapai — coba lagi skenario ini.");
  }

  return areas.slice(0, 2);
}

function suggestNextScenario(
  current: Scenario,
  objectivesCompleted: number,
  objectivesTotal: number,
  recentScenarioIds: ScenarioCategory[],
): ScenarioCategory {
  if (objectivesTotal > 0 && objectivesCompleted < objectivesTotal) return current.id;

  const recentSet = new Set(recentScenarioIds.slice(0, 5));
  const sameDifficultyFresh = SCENARIOS.find(
    (s) => s.id !== current.id && s.difficulty === current.difficulty && !recentSet.has(s.id),
  );
  if (sameDifficultyFresh) return sameDifficultyFresh.id;

  const anyFresh = SCENARIOS.find((s) => s.id !== current.id && !recentSet.has(s.id));
  if (anyFresh) return anyFresh.id;

  const idx = SCENARIOS.findIndex((s) => s.id === current.id);
  return SCENARIOS[(idx + 1) % SCENARIOS.length].id;
}

export function computeSessionSummary({
  scenario,
  messages,
  durationSeconds,
  objectivesCompleted,
  objectivesTotal,
  recentScenarioIds,
}: ComputeSessionSummaryInput): SessionSummary {
  const evaluations = collectEvaluations(messages);
  return {
    scenarioId: scenario.id,
    durationSeconds,
    messageCount: messages.length,
    vocabularyLearned: dedupeVocabulary(evaluations),
    grammarObservations: computeGrammarObservations(evaluations),
    strengths: computeStrengths(evaluations, objectivesCompleted, objectivesTotal),
    areasForImprovement: computeAreasForImprovement(evaluations, objectivesCompleted, objectivesTotal),
    suggestedNextScenarioId: suggestNextScenario(scenario, objectivesCompleted, objectivesTotal, recentScenarioIds),
  };
}
