import { ChatBubble } from "@/components/domain/ai-speaking/ChatBubble";
import type { ConversationHistoryEntry } from "@/types/learning";

interface HistoryTranscriptViewProps {
  entry: ConversationHistoryEntry;
}

/** Read-only reopen of a completed session's transcript — reuses ChatBubble exactly as the live session does, just with retry/replay-TTS hidden via `readOnly`. */
export function HistoryTranscriptView({ entry }: HistoryTranscriptViewProps) {
  return (
    <div className="flex-1">
      {entry.messages.map((message, i) => (
        <div key={message.id} className={message.role === "user" && i > 0 ? "mt-5" : "mt-1.5"}>
          <ChatBubble message={message} scenarioId={entry.scenarioId} isSpeaking={false} onReplay={() => {}} readOnly />
        </div>
      ))}
    </div>
  );
}
