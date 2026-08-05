import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TUTOR_NAME } from "./TutorIdentity";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label={`${TUTOR_NAME} sedang mengetik`}>
      <Avatar className="mb-1 h-7 w-7">
        <AvatarFallback className="bg-accent-muted text-accent-foreground">{TUTOR_NAME[0]}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-lg bg-surface px-4 py-3 shadow-resting">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
