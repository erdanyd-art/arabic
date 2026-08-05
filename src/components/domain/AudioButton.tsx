import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { createArabicUtterance } from "@/lib/speech";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md";
  className?: string;
}

export function AudioButton({ text, size = "md", className }: AudioButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function handleClick() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = createArabicUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  const dimension = size === "sm" ? "h-8 w-8" : "h-11 w-11";

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      aria-label={`Dengarkan pengucapan: ${text}`}
      aria-pressed={isSpeaking}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent-foreground transition-colors hover:brightness-95",
        dimension,
        className,
      )}
    >
      {isSpeaking && (
        <motion.span
          className="absolute inset-0 rounded-full bg-accent/40"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <Volume2 className={cn("relative", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
    </motion.button>
  );
}
