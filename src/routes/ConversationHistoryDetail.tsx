import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HistoryStorage } from "@/storage/HistoryStorage";
import { HistoryTranscriptView } from "@/features/history/HistoryTranscriptView";
import { SessionSummaryView } from "@/features/summary/SessionSummaryView";

export function ConversationHistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entry = id ? HistoryStorage.getById(id) : undefined;
  const defaultTab = searchParams.get("tab") === "transkrip" ? "transkrip" : "ringkasan";

  if (!entry) {
    return (
      <AppShell>
        <TopBar title="Percakapan tidak ditemukan" onBack={() => navigate("/riwayat")} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sesi ini mungkin sudah dihapus.
        </p>
        <Button className="mt-4" onClick={() => navigate("/riwayat")}>
          Kembali ke Riwayat
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={entry.scenarioTitle} subtitle={`${entry.messageCount} pesan`} onBack={() => navigate("/riwayat")} />
      <Tabs defaultValue={defaultTab} className="flex flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
          <TabsTrigger value="transkrip">Transkrip</TabsTrigger>
        </TabsList>
        <TabsContent value="ringkasan" className="mt-4 flex flex-1 flex-col">
          <SessionSummaryView entry={entry} />
        </TabsContent>
        <TabsContent value="transkrip" className="mt-4 flex-1">
          <HistoryTranscriptView entry={entry} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
