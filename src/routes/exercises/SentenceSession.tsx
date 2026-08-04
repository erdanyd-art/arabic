import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pause, Play, Repeat, RotateCcw, Square } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { sentenceTopics } from "@/data/sentenceTopics";
import { useAppStore } from "@/store/useAppStore";
import { stopSpeaking } from "@/lib/speech";

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
      <PageShell>
        <SessionHeader title="Kalimat" onBack={() => navigate("/kalimat/setup")} />
        <p className="text-center text-sm text-slate-400">Topik tidak ditemukan.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SessionHeader title={topic.title} onBack={() => navigate("/kalimat/setup")} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setIsPlaying(false);
              setActiveIndex(0);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            aria-label="Ulangi dari awal"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setIsPlaying(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            aria-label="Berhenti"
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setLoop((l) => !l)}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${loop ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
            aria-label="Ulang otomatis"
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${showTranslation ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
        >
          Terjemahkan
        </button>
      </div>

      <div className="mb-5 flex items-center justify-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={`rounded-lg px-2.5 py-1.5 ${speed === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {topic.sentences.map((sentence, i) => (
          <button
            key={sentence.id}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setIsPlaying(true);
            }}
            className={`w-full rounded-2xl border-2 p-5 text-center transition-colors ${
              i === activeIndex ? "border-indigo-300 bg-indigo-50" : "border-transparent bg-white"
            }`}
          >
            <p className="mb-2 text-xs font-semibold text-slate-400">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="font-arabic text-2xl leading-relaxed text-slate-900">{sentence.arabic}</p>
            {showTranslation && (
              <p className="mt-2 text-sm text-slate-500">{sentence.translation}</p>
            )}
          </button>
        ))}
      </div>
    </PageShell>
  );
}
