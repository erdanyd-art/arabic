import { BookOpen, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingDialog } from "@/components/domain/OnboardingDialog";
import { useAppStore } from "@/store/useAppStore";

const KIND_LABEL: Record<string, string> = {
  kosakata: "Kosakata",
  kalimat: "Kalimat",
  percakapan: "Percakapan",
  quran: "Al-Quran",
  umrah: "Panduan Umrah",
  haji: "Panduan Haji",
};

export function Home() {
  const navigate = useNavigate();
  const history = useAppStore((state) => state.history);
  const clearHistory = useAppStore((state) => state.clearHistory);

  return (
    <AppShell>
      <OnboardingDialog />

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-raised">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground">Lisan Coach</h1>
            <p className="text-sm text-muted-foreground">Latihan pengucapan Bahasa Arab</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button size="lg" className="w-full" onClick={() => navigate("/pilih-mode")}>
          <Sparkles className="h-4 w-4" /> Latihan Baru
        </Button>
      </motion.div>

      <div className="mt-10 flex-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-muted">
              <BookOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Belum ada sesi latihan</p>
            <p className="text-sm text-muted-foreground">Ketuk "Latihan Baru" untuk mulai</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mb-2 flex items-center justify-between">
              <Label>Riwayat sesi</Label>
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-danger"
              >
                <Trash2 className="h-3 w-3" /> Hapus riwayat
              </button>
            </div>
            {history.map((entry) => (
              <Card key={entry.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.topicTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.completedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {entry.total !== undefined && (
                    <span className="text-sm font-bold text-primary">
                      {entry.score}/{entry.total}
                    </span>
                  )}
                  <Badge variant="neutral">{KIND_LABEL[entry.kind]}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}
