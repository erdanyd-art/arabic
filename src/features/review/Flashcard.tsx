import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FlashcardProps {
  front: string;
  back: string;
  revealed: boolean;
  onReveal: () => void;
}

export function Flashcard({ front, back, revealed, onReveal }: FlashcardProps) {
  return (
    <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 text-center">
      <p lang="ar" dir="rtl" className="font-arabic text-3xl leading-relaxed text-foreground">
        {front}
      </p>
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.p
            key="back"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            {back}
          </motion.p>
        ) : (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Button variant="secondary" size="sm" className="mt-6" onClick={onReveal}>
              Tampilkan jawaban
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
