import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { VocabularyList } from "@/features/vocabulary/VocabularyList";
import { ExpressionList } from "@/features/expressions/ExpressionList";
import { HistoryList } from "@/features/history/HistoryList";

/**
 * Tabbed entry point from ModeSelect ("Buku Belajar") — reuses the exact
 * same feature components as the standalone routes (/kosakata-tersimpan,
 * /ekspresi-tersimpan, /riwayat), so there's one implementation of each
 * list, just two ways to reach it.
 */
export function LearningNotebook() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <TopBar title="Buku Belajar" subtitle="Kosakata, ungkapan, dan riwayat percakapanmu" />
      <Tabs defaultValue="kosakata" className="flex flex-1 flex-col">
        <TabsList className="grid-cols-4">
          <TabsTrigger value="kosakata">Kosakata</TabsTrigger>
          <TabsTrigger value="ekspresi">Ekspresi</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          <TabsTrigger value="ulas">Ulas</TabsTrigger>
        </TabsList>
        <TabsContent value="kosakata" className="mt-4 flex flex-1 flex-col">
          <VocabularyList />
        </TabsContent>
        <TabsContent value="ekspresi" className="mt-4 flex flex-1 flex-col">
          <ExpressionList />
        </TabsContent>
        <TabsContent value="riwayat" className="mt-4 flex-1">
          <HistoryList />
        </TabsContent>
        <TabsContent value="ulas" className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-muted">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">Ulas kosakata & ungkapan</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Latihan flashcard singkat dari semua yang sudah kamu simpan.
          </p>
          <Button className="mt-1" onClick={() => navigate("/ulas")}>
            Mulai Sesi Ulasan
          </Button>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
