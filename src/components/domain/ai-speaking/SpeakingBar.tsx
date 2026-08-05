import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AudioWaveform } from "./AudioWaveform";
import { TUTOR_NAME } from "./TutorIdentity";

interface SpeakingBarProps {
  visible: boolean;
  onStop: () => void;
}

export function SpeakingBar({ visible, onStop }: SpeakingBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-3 flex items-center gap-3 overflow-hidden rounded-md bg-accent-muted px-4 py-2.5"
        >
          <Volume2 className="h-4 w-4 shrink-0 text-accent-foreground" />
          <span className="shrink-0 text-xs font-semibold text-accent-foreground">
            {TUTOR_NAME} sedang bicara
          </span>
          <AudioWaveform mode="ambient" tone="primary" barCount={16} className="h-5 flex-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onStop}
            aria-label={`Hentikan suara ${TUTOR_NAME}`}
            className="shrink-0 text-accent-foreground"
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
