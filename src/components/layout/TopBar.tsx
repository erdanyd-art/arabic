import { ArrowLeft, Home } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideHome?: boolean;
  actions?: ReactNode;
}

export function TopBar({ title, subtitle, onBack, hideHome, actions }: TopBarProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-5 flex items-center justify-between gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Kembali"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-bold text-foreground">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {actions}
        {!hideHome && (
          <Button variant="secondary" size="icon" onClick={() => navigate("/")} aria-label="Beranda">
            <Home className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
