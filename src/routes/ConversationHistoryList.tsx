import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { HistoryList } from "@/features/history/HistoryList";

export function ConversationHistoryList() {
  return (
    <AppShell>
      <TopBar title="Riwayat Percakapan" subtitle="Sesi latihan bicara yang sudah selesai" />
      <HistoryList />
    </AppShell>
  );
}
