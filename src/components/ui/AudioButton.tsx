import { Volume2 } from "lucide-react";
import { speakArabic } from "@/lib/speech";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md";
}

export function AudioButton({ text, size = "md" }: AudioButtonProps) {
  const dimension = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <button
      type="button"
      onClick={() => speakArabic(text)}
      aria-label="Dengarkan pengucapan"
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-colors hover:bg-amber-200`}
    >
      <Volume2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </button>
  );
}
