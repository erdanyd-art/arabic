import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  tone?: "indigo" | "amber";
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}

const TONE_CLASSES: Record<NonNullable<PrimaryButtonProps["tone"]>, string> = {
  indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
  amber: "bg-amber-500 hover:bg-amber-600 text-white",
};

export function PrimaryButton({
  children,
  tone = "indigo",
  icon,
  className = "",
  disabled,
  type = "button",
  onClick,
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}
