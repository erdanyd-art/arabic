import { AlertTriangle, ArrowRight, MicOff, RotateCcw, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** "danger" (default) for real failures worth retrying; "neutral" for calm, non-alarming, longer-lived states like "feature not available right now". */
  tone?: "danger" | "neutral";
}

const TONE_CLASS = {
  danger: {
    container: "border-danger/30 bg-danger-muted",
    icon: "text-danger",
    title: "text-danger",
    description: "text-danger/80",
    button: "destructive" as const,
  },
  neutral: {
    container: "border-border bg-surface-muted",
    icon: "text-muted-foreground",
    title: "text-foreground",
    description: "text-muted-foreground",
    button: "secondary" as const,
  },
};

export function ErrorBanner({
  icon: Icon = AlertTriangle,
  title,
  description,
  actionLabel,
  onAction,
  tone = "danger",
}: ErrorBannerProps) {
  const classes = TONE_CLASS[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      role={tone === "danger" ? "alert" : "status"}
      className={cn("mb-3 flex items-start gap-3 rounded-md border px-4 py-3", classes.container)}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", classes.icon)} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", classes.title)}>{title}</p>
        <p className={cn("mt-0.5 text-xs", classes.description)}>{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant={classes.button} size="sm" onClick={onAction} className="shrink-0">
          {tone === "danger" ? <RotateCcw className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export const MicOffIcon = MicOff;
export const WifiOffIcon = WifiOff;
