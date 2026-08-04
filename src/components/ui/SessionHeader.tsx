import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function SessionHeader({ title, subtitle, onBack }: SessionHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Kembali"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate font-semibold text-slate-800">{title}</p>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Beranda"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
      >
        <Home className="h-4 w-4" />
      </button>
    </div>
  );
}
