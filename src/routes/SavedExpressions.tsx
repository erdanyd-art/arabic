import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { ExpressionList } from "@/features/expressions/ExpressionList";

export function SavedExpressions() {
  return (
    <AppShell>
      <TopBar title="Ungkapan Tersimpan" subtitle="Kalimat tutor yang sudah kamu bookmark" />
      <ExpressionList />
    </AppShell>
  );
}
