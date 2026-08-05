import { Check, Loader2, Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import type { RecordingState } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  state: RecordingState;
  levelAvg: number;
  disabled?: boolean;
  onPress: () => void;
}

const STATE_LABEL: Record<RecordingState, string> = {
  idle: "Tekan untuk mulai bicara",
  listening: "Sedang mendengarkan... tekan untuk berhenti",
  processing: "Memproses ucapanmu...",
  finished: "Rekaman selesai — tekan untuk rekam lagi",
  error: "Coba lagi",
};

export function MicButton({ state, levelAvg, disabled, onPress }: MicButtonProps) {
  const isListening = state === "listening";
  const isBusyState = state === "processing";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {isListening && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-danger/25"
              animate={{ scale: 1 + levelAvg * 0.6, opacity: 0.5 - levelAvg * 0.2 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-danger/15"
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <motion.button
          type="button"
          onClick={onPress}
          disabled={disabled || isBusyState}
          whileTap={{ scale: 0.94 }}
          animate={state === "finished" ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.35 }}
          aria-label={STATE_LABEL[state]}
          aria-pressed={isListening}
          className={cn(
            "relative flex h-20 w-20 items-center justify-center rounded-full shadow-floating transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-60",
            isListening
              ? "bg-danger text-danger-foreground"
              : state === "finished"
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground",
          )}
        >
          {state === "processing" ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : state === "listening" ? (
            <Square className="h-6 w-6" />
          ) : state === "finished" ? (
            <Check className="h-7 w-7" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </motion.button>
      </div>
      <p role="status" aria-live="polite" className="text-xs font-medium text-muted-foreground">
        {STATE_LABEL[state]}
      </p>
    </div>
  );
}
