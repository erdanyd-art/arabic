import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0..1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <motion.div
        className="h-full rounded-full bg-amber-500"
        animate={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />
    </div>
  );
}
