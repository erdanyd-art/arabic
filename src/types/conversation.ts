export type ChatRole = "user" | "tutor";

export type Difficulty = "pemula" | "menengah" | "lanjutan";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  lanjutan: "Lanjutan",
};

// --- Evaluation ---------------------------------------------------------
// One card per learner message. Each field is its own evaluator so a
// future feature (pronunciation, CEFR estimate, confidence score, …) can
// be added as a new optional field without touching what already exists —
// see prompts/evaluation.ts and components/domain/ai-speaking/EvaluationCard.tsx.

export interface VocabularyNote {
  word: string;
  meaning: string;
}

export interface Evaluation {
  grammar: {
    correct: boolean;
    note: string;
  };
  natural: {
    /** Present only when a native speaker would phrase it differently. */
    rewrite?: string;
    note: string;
  };
  vocabulary: VocabularyNote[];
  fluency: {
    note: string;
  };
  suggestion: string;
  /** Ids of this scenario's `objectives` that this exchange addressed, if any — powers live goal-tracking (see features/goals/useSessionGoals.ts). Empty/absent means none this turn. */
  goalsAddressed?: string[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  translation?: string;
  timestamp: number;
  failed?: boolean;
  /** Only ever set on `role: "user"` messages. */
  evaluation?: Evaluation;
}

export type ScenarioCategory =
  | "daily"
  | "restaurant"
  | "shopping"
  | "airport"
  | "hotel"
  | "classroom"
  | "interview"
  | "friends";

export interface ScenarioObjective {
  id: string;
  label: string;
}

export interface Scenario {
  id: ScenarioCategory;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** Learning goals for this scenario, auto-marked done via Evaluation.goalsAddressed — see features/goals/. */
  objectives: ScenarioObjective[];
}

export interface TutorReply {
  text: string;
  translation?: string;
}

/** What one conversational turn produces: the tutor's reply, plus an evaluation of the learner's message that prompted it. */
export interface TurnResult {
  reply: TutorReply;
  evaluation?: Evaluation;
}

// --- Layered AI architecture ---------------------------------------------
// UI (hooks/useConversation, the "conversation service")
//   → services/tutorService.ts  (assembles prompts, parses model output)
//     → an AiProvider            (raw text in / text out — knows nothing
//                                  about personas, scenarios or evaluation)
//       → Grok, or MockProvider for fully-offline development/demo
// The UI never imports a provider directly.

export interface AiProvider {
  /** Sends the assembled system prompt + running history, returns the raw model output as a single string (already fully awaited — no streaming leaks past this boundary). */
  complete(systemPrompt: string, history: ChatMessage[]): Promise<string>;
}
