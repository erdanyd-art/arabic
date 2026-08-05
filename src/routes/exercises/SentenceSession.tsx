import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Languages, Pause, Play, Repeat, RotateCcw, SearchX, Square } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/domain/EmptyState";
import { sentenceTopics } from "@/data/sentenceTopics";
import { useAppStore } from "@/store/useAppStore";
import { stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export function SentenceSession() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addHistoryEntry = useAppStore((state) => state.addHistoryEntry);
  const topic = sentenceTopics.find((item) => item.id === topicId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (!isPlaying || !topic) return;
    const sentence = topic.sentences[activeIndex];
    if (!sentence || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(sentence.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = speed;
    utterance.onend = () => {
      if (activeIndex + 1 < topic.sentences.length) {
        setActiveIndex((i) => i + 1);
        return;
      }
      if (loop) {
        setActiveIndex(0);
        return;
      }
      setIsPlaying(false);
      if (!loggedRef.current) {
        loggedRef.current = true;
        addHistoryEntry({ kind: "kalimat", topicTitle: topic.title });
      }
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, activeIndex, speed, topic, loop]);

  if (!topic) {
    return (
      <AppShell>
        <TopBar title="Kalimat" onBack={() => navigate("/kalimat/setup")} />
        <EmptyState
          icon={SearchX}
          title="Topik tidak ditemukan"
          description="Sesi ini mungkin sudah dihapus atau tautannya tidak valid."
          actionLabel="Pilih topik lain"
          onAction={() => navigate("/kalimat/setup")}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={topic.title} onBack={() => navigate("/kalimat/setup")} />

      <Card className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Ulangi dari awal"
            onClick={() => {
              stopSpeaking();
              setIsPlaying(false);
              setActiveIndex(0);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Berhenti"
            onClick={() => {
              stopSpeaking();
              setIsPlaying(false);
            }}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            aria-label={isPlaying ? "Jeda" : "Putar"}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant={loop ? "primary" : "secondary"}
            size="icon-sm"
            aria-label="Ulang otomatis"
            aria-pressed={loop}
            onClick={() => setLoop((l) => !l)}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant={showTranslation ? "primary" : "secondary"}
          size="sm"
          aria-pressed={showTranslation}
          onClick={() => setShowTranslation((v) => !v)}
        >
          <Languages className="h-3.5 w-3.5" /> Terjemahkan
        </Button>
      </Card>

      <div className="mb-5 flex items-center justify-center gap-1 rounded-md bg-surface-muted p-1 text-xs font-semibold">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={cn(
              "rounded-xs px-2.5 py-1.5 transition-colors",
              speed === s ? "bg-surface text-primary shadow-resting" : "text-muted-foreground",
            )}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {topic.sentences.map((sentence, i) => (
          <motion.button
            key={sentence.id}
            type="button"
            layout
            onClick={() => {
              setActiveIndex(i);
              setIsPlaying(true);
            }}
            className={cn(
              "w-full rounded-lg border-2 p-5 text-center shadow-resting transition-colors",
              i === activeIndex ? "border-primary bg-primary-muted" : "border-transparent bg-surface",
            )}
          >
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p lang="ar" className="font-arabic text-2xl leading-relaxed text-foreground">
              {sentence.arabic}
            </p>
            {showTranslation && (
              <p className="mt-2 text-sm text-muted-foreground">{sentence.translation}</p>
            )}
          </motion.button>
        ))}
      </div>
    </AppShell>
  );
}
