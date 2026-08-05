import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shuffle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTopicForm } from "@/components/domain/CustomTopicForm";
import { useGenerateSession } from "@/hooks/useGenerateSession";
import { LEVEL_LABEL, type Level } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface SetupTopic {
  id: string;
  title: string;
  arabicTitle?: string;
  hint: string;
  level: Level;
}

interface ExerciseSetupScreenProps {
  title: string;
  description: string;
  topics: SetupTopic[];
  topicLabel?: string;
  tabLabel?: string;
  customPlaceholder: string;
  sessionBasePath: string;
  allowRandomPick?: boolean;
  extraOptions?: ReactNode;
}

export function ExerciseSetupScreen({
  title,
  description,
  topics,
  topicLabel = "Topik",
  tabLabel = "Pilih Topik",
  customPlaceholder,
  sessionBasePath,
  allowRandomPick,
  extraOptions,
}: ExerciseSetupScreenProps) {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>("pemula");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { mutateAsync, isPending } = useGenerateSession();

  const filtered = topics.filter((topic) => topic.level === level);

  async function startWithTopic(topicId: string) {
    const result = await mutateAsync({ topicId });
    navigate(`${sessionBasePath}/${result.topicId}`);
  }

  async function startCustom(prompt: string) {
    if (filtered.length === 0) {
      toast.error("Belum ada topik pembanding untuk level ini.");
      return;
    }
    const fallback = filtered[Math.floor(Math.random() * filtered.length)];
    await mutateAsync({ topicId: fallback.id });
    toast.info("Pembuatan topik AI dari teks bebas segera hadir.", {
      description: `Untuk saat ini kami pilihkan topik "${fallback.title}" agar kamu tetap bisa berlatih "${prompt}" nanti.`,
    });
    navigate(`${sessionBasePath}/${fallback.id}`);
  }

  function pickRandom() {
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedTopic(random.id);
  }

  return (
    <AppShell>
      <TopBar title={title} />
      <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mb-5">
        <Label htmlFor="level-select">Level</Label>
        <Select
          value={level}
          onValueChange={(value) => {
            setLevel(value as Level);
            setSelectedTopic(null);
          }}
        >
          <SelectTrigger id="level-select" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(LEVEL_LABEL) as Level[]).map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {LEVEL_LABEL[lvl]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="preset" className="mb-6">
        <TabsList>
          <TabsTrigger value="preset">{tabLabel}</TabsTrigger>
          <TabsTrigger value="custom">Buat Sendiri</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="mt-5 focus-visible:outline-none">
          <div className="mb-2 flex items-center justify-between">
            <Label>
              {topicLabel} ({LEVEL_LABEL[level]})
            </Label>
            {allowRandomPick && filtered.length > 0 && (
              <button
                type="button"
                onClick={pickRandom}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Shuffle className="h-3 w-3" /> Pilih Acak
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Belum ada {topicLabel.toLowerCase()} untuk level ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <motion.button
                    key={topic.id}
                    type="button"
                    layout
                    onClick={() => setSelectedTopic(topic.id)}
                    className={cn(
                      "rounded-md border-2 bg-surface p-4 text-left shadow-resting transition-colors",
                      isSelected ? "border-accent bg-accent-muted" : "border-transparent hover:border-border",
                    )}
                  >
                    <p className="text-sm font-bold text-foreground">
                      {topic.title}
                      {topic.arabicTitle && (
                        <span lang="ar" className="font-arabic font-normal text-muted-foreground">
                          {" "}
                          / {topic.arabicTitle}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{topic.hint}</p>
                  </motion.button>
                );
              })}
            </div>
          )}

          {extraOptions && <div className="mt-6 space-y-4">{extraOptions}</div>}

          <Button
            variant="accent"
            size="lg"
            className="mt-6 w-full"
            disabled={!selectedTopic || isPending}
            onClick={() => selectedTopic && startWithTopic(selectedTopic)}
          >
            <Sparkles className="h-4 w-4" />
            {isPending ? "Menyiapkan..." : "Mulai Latihan"}
          </Button>
        </TabsContent>

        <TabsContent value="custom" className="mt-5 focus-visible:outline-none">
          <CustomTopicForm placeholder={customPlaceholder} isSubmitting={isPending} onSubmit={startCustom} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
