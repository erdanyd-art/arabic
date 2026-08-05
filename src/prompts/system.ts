import { PERSONA_PROMPT } from "./persona";
import { CONVERSATION_STRATEGY_PROMPT } from "./conversation";
import { FEEDBACK_TONE_PROMPT } from "./feedback";
import { EVALUATION_SCHEMA_PROMPT } from "./evaluation";
import { buildScenarioPrompt } from "./scenario";
import type { Scenario } from "@/types/conversation";

/** Marks the boundary between the tutor's natural-language reply and the machine-readable evaluation JSON. Chosen to be extremely unlikely to appear in natural Arabic/Indonesian text. */
export const EVAL_SEPARATOR = "===EVAL===";

const RESPONSE_FORMAT_PROMPT = `Format balasanmu HARUS persis begini, tanpa markdown atau penjelasan tambahan:

<1-3 kalimat Arab sebagai balasanmu dalam peran skenario, mengikuti pola percakapan di atas — salah satu kalimatnya HARUS berupa pertanyaan lanjutan, kecuali pengguna jelas sedang mengakhiri percakapan>
→ ID: <terjemahan Indonesia singkat dari balasan itu>
${EVAL_SEPARATOR}
<satu objek JSON evaluation, tanpa code fence, sesuai skema yang dijelaskan>

Jangan tambahkan apa pun sebelum baris Arab pertama atau setelah JSON evaluation.`;

/**
 * Composes every prompt module into the final system instruction for one
 * turn. This is the only place that assembles them — nothing else should
 * build a giant inline prompt string.
 *
 * Order matters: persona (who) → scenario+difficulty (where/role/level) →
 * conversation strategy (how to actually drive the turn forward — the
 * Sprint 2.2 fix) → feedback tone + evaluation schema (what the JSON card
 * contains) → response format (the literal output contract last, so it
 * wraps everything said above).
 */
export function buildSystemPrompt(scenario: Scenario): string {
  return [
    PERSONA_PROMPT,
    buildScenarioPrompt(scenario),
    CONVERSATION_STRATEGY_PROMPT,
    FEEDBACK_TONE_PROMPT,
    EVALUATION_SCHEMA_PROMPT,
    RESPONSE_FORMAT_PROMPT,
  ].join("\n\n");
}
