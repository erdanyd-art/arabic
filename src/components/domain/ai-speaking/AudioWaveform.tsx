import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  mode: "live" | "ambient";
  levels?: number[];
  tone?: "primary" | "danger";
  barCount?: number;
  className?: string;
}

export function AudioWaveform({
  mode,
  levels,
  tone = "primary",
  barCount = 20,
  className,
}: AudioWaveformProps) {
  const bars = mode === "live" && levels ? levels : Array.from({ length: barCount });
  const colorClass = tone === "danger" ? "bg-danger" : "bg-primary";

  return (
    <div
      className={cn("flex h-10 items-center justify-center gap-[3px]", className)}
      role="img"
      aria-label={mode === "live" ? "Visualisasi suara sedang direkam" : "Visualisasi AI sedang bicara"}
    >
      {bars.map((level, i) =>
        mode === "live" ? (
          <span
            key={i}
            className={cn("w-1 rounded-full transition-[height] duration-75", colorClass)}
            style={{ height: `${Math.max(8, (level as number) * 100)}%` }}
          />
        ) : (
          <motion.span
            key={i}
            className={cn("w-1 rounded-full", colorClass)}
            animate={{ height: ["20%", `${40 + ((i * 37) % 60)}%`, "20%"] }}
            transition={{
              duration: 0.6 + (i % 5) * 0.08,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 7) * 0.05,
            }}
          />
        ),
      )}
    </div>
  );
}
