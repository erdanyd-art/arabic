import { useState } from "react";
import { Mic, RotateCcw, Square } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { scorePronunciation, type PronunciationScore } from "@/lib/pronunciationScore";
import { cn } from "@/lib/utils";

const ERROR_COPY: Record<string, string> = {
  "permission-denied": "Izin mikrofon ditolak.",
  "no-microphone": "Mikrofon tidak ditemukan.",
  unsupported: "Perekaman tidak didukung di browser ini.",
  "recognition-failed": "Gagal mengenali suara — coba lagi.",
};

interface DialoguePracticeButtonProps {
  targetText: string;
}

/**
 * Replaces the generic RecordButton for dialogue lines specifically —
 * this is a fixed-target repeat-after-me drill, so "evaluation" here
 * means comparing recognized speech against the one right answer
 * (scorePronunciation), not the AI Speaking Coach's open-ended grammar
 * evaluation, which doesn't apply to pre-written lines.
 */
export function DialoguePracticeButton({ targetText }: DialoguePracticeButtonProps) {
  const recognizer = useSpeechRecognition();
  const [result, setResult] = useState<PronunciationScore | null>(null);
  const [heardText, setHeardText] = useState("");

  async function handlePress() {
    if (recognizer.state === "idle" || recognizer.state === "error" || recognizer.state === "finished") {
      setResult(null);
      setHeardText("");
      recognizer.resetError();
      await recognizer.start();
      return;
    }
    if (recognizer.state === "listening") {
      const transcript = await recognizer.stop();
      setHeardText(transcript);
      setResult(scorePronunciation(targetText, transcript));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {recognizer.state === "listening" && (
          <Button variant="destructive" size="sm" onClick={handlePress} className="relative">
            <motion.span
              className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <Square className="h-3 w-3" /> Berhenti
          </Button>
        )}
        {recognizer.state === "processing" && (
          <Button variant="secondary" size="sm" disabled>
            Menilai...
          </Button>
        )}
        {(recognizer.state === "idle" || recognizer.state === "error") && (
          <Button variant="secondary" size="sm" onClick={handlePress}>
            <Mic className="h-3 w-3" /> Latihan
          </Button>
        )}
        {recognizer.state === "finished" && result && (
          <Button variant="secondary" size="sm" onClick={handlePress}>
            <RotateCcw className="h-3 w-3" /> Coba lagi
          </Button>
        )}
      </div>

      {recognizer.errorKind && (
        <p className="text-[11px] text-danger">{ERROR_COPY[recognizer.errorKind]}</p>
      )}

      {result && (
        <div className="max-w-xs space-y-1.5 rounded-md bg-surface-muted px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "font-semibold",
                result.score >= 0.8 ? "text-success" : result.score >= 0.5 ? "text-accent" : "text-danger",
              )}
            >
              {result.matchedCount}/{result.totalCount} kata
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {result.words.map((w, i) => (
              <span
                key={i}
                lang="ar"
                dir="rtl"
                className={cn("font-arabic text-sm", w.matched ? "text-success" : "text-danger line-through")}
              >
                {w.word}
              </span>
            ))}
          </div>

          {/* What the recognizer actually heard — without this, a low score is unexplainable noise instead of something the learner can see and judge for themselves. */}
          {heardText.trim() ? (
            <p className="text-[11px] text-muted-foreground">
              Terdengar: <span lang="ar" dir="rtl" className="font-arabic">{heardText}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">Tidak ada suara yang terdengar.</p>
          )}
        </div>
      )}
    </div>
  );
}
