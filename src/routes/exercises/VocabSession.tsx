import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AudioButton } from "@/components/ui/AudioButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { vocabTopics } from "@/data/vocabTopics";
import { useAppStore } from "@/store/useAppStore";

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
  }, [word]);

  if (!topic || !word) {
    return (
      <PageShell>
        <SessionHeader title="Kosakata" onBack={() => navigate("/kosakata/setup")} />
        <p className="text-center text-sm text-slate-400">Topik tidak ditemukan.</p>
      </PageShell>
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
    return (
      <PageShell>
        <SessionHeader title={topic.title} onBack={() => navigate("/kosakata/setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <PartyPopper className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-slate-800">Latihan selesai!</p>
          <p className="text-sm text-slate-500">
            Kamu menjawab benar {correctCount} dari {topic.words.length} kata.
          </p>
          <div className="mt-4 w-full space-y-3">
            <PrimaryButton
              tone="amber"
              onClick={() => {
                setIndex(0);
                setAnswered(null);
                setCorrectCount(0);
                setFinished(false);
              }}
            >
              Ulangi Topik
            </PrimaryButton>
            <PrimaryButton onClick={() => navigate("/")}>Kembali ke Beranda</PrimaryButton>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SessionHeader
        title={topic.title}
        subtitle={`Kata ${index + 1} dari ${topic.words.length} · ${correctCount} selesai`}
        onBack={() => navigate("/kosakata/setup")}
      />
      <div className="mb-6">
        <ProgressBar progress={(index + 1) / topic.words.length} />
      </div>

      <motion.div
        key={word.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <p className="font-arabic text-4xl text-slate-900">{word.arabic}</p>
            <AudioButton text={word.arabic} />
          </div>
          <p className="text-sm italic text-amber-600">{word.transliteration}</p>
        </div>

        <p className="mb-3 mt-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                  showState && isCorrect
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : showState && isChosen
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={index === 0}
          className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 disabled:opacity-40"
        >
          ← Sebelumnya
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!answered}
          className="flex-1 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Berikutnya →
        </button>
      </div>
    </PageShell>
  );
}
