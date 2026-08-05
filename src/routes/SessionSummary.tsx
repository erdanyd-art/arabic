import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { HistoryStorage } from "@/storage/HistoryStorage";
import { SessionSummaryView } from "@/features/summary/SessionSummaryView";

export function SessionSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entry = id ? HistoryStorage.getById(id) : undefined;

  if (!entry) {
    return (
      <AppShell>
        <TopBar title="Ringkasan tidak ditemukan" hideHome={false} />
        <p className="mt-4 text-center text-sm text-muted-foreground">Sesi ini tidak ditemukan.</p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title="Ringkasan Sesi" onBack={() => navigate("/")} />
      <SessionSummaryView entry={entry} />
    </AppShell>
  );
}
