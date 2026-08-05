import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TUTOR_NAME } from "@/prompts/persona";

// Rotates so the wait (Grok is a reasoning model — combined reply +
// evaluation can take a few seconds) reads as the tutor actively working,
// not a stalled spinner.
const THINKING_MESSAGES = [
  `${TUTOR_NAME} menyimak...`,
  "Menyusun balasan...",
  "Menyiapkan evaluasi...",
];

export function TypingIndicator() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % THINKING_MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-end gap-2" role="status" aria-label={`${TUTOR_NAME} sedang berpikir`}>
      <Avatar className="mb-1 h-7 w-7">
        <AvatarFallback className="bg-accent-muted text-accent-foreground">{TUTOR_NAME[0]}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 rounded-lg bg-surface px-4 py-3 shadow-resting">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground"
          >
            {THINKING_MESSAGES[step]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
