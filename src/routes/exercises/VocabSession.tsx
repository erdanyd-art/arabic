import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, RotateCcw, SearchX } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/components/domain/AudioButton";
import { EmptyState } from "@/components/domain/EmptyState";
import { vocabTopics } from "@/data/vocabTopics";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function VocabSession() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addHistoryEntry = useAppStore((state) => state.addHistoryEntry);
  const topic = vocabTopics.find((item) => item.id === topicId);

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const word = topic?.words[index];
  const choices = useMemo(() => {
    if (!word) return [];
    return shuffle([word.meaning, ...word.distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id]);

  if (!topic || !word) {
    return (
      <AppShell>
        <TopBar title="Kosakata" onBack={() => navigate("/kosakata/setup")} />
        <EmptyState
          icon={SearchX}
          title="Topik tidak ditemukan"
          description="Sesi ini mungkin sudah dihapus atau tautannya tidak valid."
          actionLabel="Pilih topik lain"
          onAction={() => navigate("/kosakata/setup")}
        />
      </AppShell>
    );
  }

  function handleAnswer(choice: string) {
    if (answered) return;
    setAnswered(choice);
    if (choice === word!.meaning) setCorrectCount((count) => count + 1);
  }

  function handleNext() {
    if (index + 1 >= topic!.words.length) {
      addHistoryEntry({
        kind: "kosakata",
        topicTitle: topic!.title,
        score: correctCount,
        total: topic!.words.length,
      });
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(null);
  }

  function handlePrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setAnswered(null);
  }

  if (finished) {
    const ratio = correctCount / topic.words.length;
    return (
      <AppShell>
        <TopBar title={topic.title} onBack={() => navigate("/kosakata/setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-accent-foreground"
          >
            <PartyPopper className="h-8 w-8" />
          </motion.div>
          <p className="text-lg font-extrabold text-foreground">Latihan selesai!</p>
          <p className="text-sm text-muted-foreground">
            Kamu menjawab benar {correctCount} dari {topic.words.length} kata (
            {Math.round(ratio * 100)}%).
          </p>
          <div className="mt-4 w-full space-y-3">
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={() => {
                setIndex(0);
                setAnswered(null);
                setCorrectCount(0);
                setFinished(false);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Ulangi Topik
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate("/")}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar
        title={topic.title}
        subtitle={`Kata ${index + 1} dari ${topic.words.length} · ${correctCount} benar`}
        onBack={() => navigate("/kosakata/setup")}
      />
      <div className="mb-6">
        <Progress value={((index + 1) / topic.words.length) * 100} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={word.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center gap-3">
                <p lang="ar" className="font-arabic text-4xl text-foreground">
                  {word.arabic}
                </p>
                <AudioButton text={word.arabic} />
              </div>
              <p className="text-sm italic text-accent-foreground">{word.transliteration}</p>
            </div>

            <p className="mb-3 mt-6 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Apa arti kata ini?
            </p>
            <div className="space-y-3">
              {choices.map((choice) => {
                const isCorrect = choice === word.meaning;
                const isChosen = choice === answered;
                const showState = answered !== null;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleAnswer(choice)}
                    className={cn(
                      "w-full rounded-md border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
                      showState && isCorrect
                        ? "border-success bg-success-muted text-success"
                        : showState && isChosen
                          ? "border-danger bg-danger-muted text-danger"
                          : "border-border text-foreground hover:border-primary/40",
                    )}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={handlePrev} disabled={index === 0}>
          ← Sebelumnya
        </Button>
        <Button variant="accent" size="lg" className="flex-1" onClick={handleNext} disabled={!answered}>
          Berikutnya →
        </Button>
      </div>
    </AppShell>
  );
}
