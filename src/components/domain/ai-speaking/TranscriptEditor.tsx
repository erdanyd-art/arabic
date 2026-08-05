import { ArrowUp, Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TranscriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TranscriptEditor({ value, onChange, onSend, disabled, placeholder }: TranscriptEditorProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend();
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder ?? "Rekam atau ketik di sini..."}
          disabled={disabled}
          dir={value ? "rtl" : "ltr"}
          lang={value ? "ar" : undefined}
          className={cn("pr-16", value && "font-arabic")}
          aria-label="Transkrip pesan — bisa diedit sebelum dikirim"
        />
        {value && (
          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              aria-label="Salin transkrip"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange("")}
              aria-label="Hapus transkrip"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        aria-label="Kirim pesan"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
