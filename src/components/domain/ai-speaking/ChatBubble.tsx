import { AlertTriangle, Check, Copy, RotateCcw, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChatMessage, ScenarioCategory } from "@/types/conversation";
import { cn } from "@/lib/utils";
import { TUTOR_NAME } from "@/prompts/persona";
import { SaveExpressionButton } from "@/features/expressions/SaveExpressionButton";
import { EvaluationCard } from "./EvaluationCard";

interface ChatBubbleProps {
  message: ChatMessage;
  scenarioId: ScenarioCategory;
  isSpeaking: boolean;
  onReplay: (id: string) => void;
  onRetry?: () => void;
  /** Hides retry/replay-TTS controls for reopened, read-only history transcripts (features/history/HistoryTranscriptView.tsx). Copy and the evaluation card still work — there's nothing "live" about them. */
  readOnly?: boolean;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({ message, scenarioId, isSpeaking, onReplay, onRetry, readOnly }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op, button simply won't confirm
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className="mb-1 h-7 w-7">
        <AvatarFallback className={isUser ? "bg-primary/15 text-primary" : "bg-accent-muted text-accent-foreground"}>
          {isUser ? "K" : TUTOR_NAME[0]}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex max-w-[78%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3 shadow-resting",
            isUser ? "bg-primary text-primary-foreground" : "bg-surface text-foreground",
            message.failed && "border border-danger/50",
          )}
        >
          {message.text ? (
            <p lang="ar" dir="rtl" className="font-arabic text-lg leading-relaxed">
              {message.text}
            </p>
          ) : (
            <span className="text-sm text-muted-foreground">…</span>
          )}
          {message.translation && (
            <p className={cn("mt-1.5 text-xs", isUser ? "opacity-80" : "text-muted-foreground")}>
              {message.translation}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>

          {message.failed && onRetry && !readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-[11px] text-danger"
              onClick={onRetry}
              aria-label="Kirim ulang pesan"
            >
              <RotateCcw className="h-3 w-3" /> Kirim ulang
            </Button>
          )}
          {message.failed && !onRetry && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-danger">
              <AlertTriangle className="h-3 w-3" /> Gagal terkirim
            </span>
          )}

          {!isUser && message.text && (
            <>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1.5 text-[11px] text-muted-foreground"
                  onClick={() => onReplay(message.id)}
                  disabled={isSpeaking}
                  aria-label="Putar ulang suara tutor"
                >
                  <Volume2 className="h-3 w-3" /> {isSpeaking ? "Bicara..." : "Putar ulang"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-[11px] text-muted-foreground"
                onClick={handleCopy}
                aria-label="Salin teks balasan tutor"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Tersalin" : "Salin"}
              </Button>
              <SaveExpressionButton arabic={message.text} translation={message.translation} scenarioId={scenarioId} />
            </>
          )}
        </div>

        {isUser && message.evaluation && (
          <EvaluationCard evaluation={message.evaluation} example={message.text} scenarioId={scenarioId} />
        )}
      </div>
    </motion.div>
  );
}
