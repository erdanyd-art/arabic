import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { VocabularyList } from "@/features/vocabulary/VocabularyList";

export function VocabularyNotebook() {
  return (
    <AppShell>
      <TopBar title="Catatan Kosakata" subtitle="Kata-kata yang sudah kamu simpan" />
      <VocabularyList />
    </AppShell>
  );
}
