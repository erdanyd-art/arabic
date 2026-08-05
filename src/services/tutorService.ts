import { buildSystemPrompt, EVAL_SEPARATOR } from "@/prompts/system";
import type { AiProvider, ChatMessage, Evaluation, Scenario, TurnResult } from "@/types/conversation";

const TRANSLATION_MARKER = "→ ID:";

function parseReplySection(raw: string): { text: string; translation?: string } {
  const idx = raw.indexOf(TRANSLATION_MARKER);
  if (idx === -1) return { text: raw.trim() };
  return {
    text: raw.slice(0, idx).trim(),
    translation: raw.slice(idx + TRANSLATION_MARKER.length).trim(),
  };
}

/** Loosely validates the model's evaluation JSON matches what EvaluationCard expects — malformed/missing fields degrade to `undefined` rather than throwing, so a parsing hiccup never breaks the conversation itself. */
function parseEvaluationSection(raw: string | undefined): Evaluation | undefined {
  if (!raw) return undefined;
  try {
    // models sometimes wrap JSON in ```json fences despite instructions not to
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed?.grammar?.correct === "boolean" &&
      typeof parsed?.grammar?.note === "string" &&
      typeof parsed?.natural?.note === "string" &&
      Array.isArray(parsed?.vocabulary) &&
      typeof parsed?.fluency?.note === "string" &&
      typeof parsed?.suggestion === "string"
    ) {
      return parsed as Evaluation;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Mid layer of the AI stack: assembles the full prompt from `prompts/*`
 * for the given scenario, calls whichever `AiProvider` it's given, and
 * parses the raw text into a structured `TurnResult`. This is the ONLY
 * place that knows the reply/evaluation wire format — providers just
 * move text, and `useConversation` (the conversation service) just
 * consumes the parsed result.
 */
export async function getNextTurn(
  provider: AiProvider,
  scenario: Scenario,
  history: ChatMessage[],
): Promise<TurnResult> {
  const systemPrompt = buildSystemPrompt(scenario);
  const raw = await provider.complete(systemPrompt, history);

  const [replyRaw, evalRaw] = raw.split(EVAL_SEPARATOR);
  const reply = parseReplySection(replyRaw ?? raw);
  const evaluation = parseEvaluationSection(evalRaw);

  return { reply, evaluation };
}
