import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TUTOR_NAME } from "@/prompts/persona";

interface TutorIdentityProps {
  size?: "lg" | "sm";
  intro?: string;
  className?: string;
}

/**
 * Gives the tutor a face and a name so the app reads as "practicing with
 * Lisan" rather than "chatting with an AI". `size="lg"` is the full
 * introduction shown in the empty state; `size="sm"` is the compact strip
 * shown once a scenario/session is active.
 */
export function TutorIdentity({ size = "lg", intro, className }: TutorIdentityProps) {
  if (size === "sm") {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent-muted text-sm font-bold text-accent-foreground">
              {TUTOR_NAME[0]}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-success" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-foreground">{TUTOR_NAME}</p>
          <p className="text-[11px] leading-tight text-muted-foreground">Siap membantumu berlatih</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-accent-muted text-lg font-bold text-accent-foreground">
            {TUTOR_NAME[0]}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
      </div>
      <div className="min-w-0 text-left">
        <p className="text-sm font-bold text-foreground">
          {TUTOR_NAME} <span className="font-normal text-muted-foreground">· Tutor Bahasa Arab-mu</span>
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {intro ?? "Halo! Pilih skenario di bawah, lalu ajak aku ngobrol pakai suaramu."}
        </p>
      </div>
    </motion.div>
  );
}
