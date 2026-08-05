import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CheckCircle2, MicOff, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { MicButton } from "@/components/domain/ai-speaking/MicButton";
import { AudioWaveform } from "@/components/domain/ai-speaking/AudioWaveform";
import { ChatBubble } from "@/components/domain/ai-speaking/ChatBubble";
import { TypingIndicator } from "@/components/domain/ai-speaking/TypingIndicator";
import { SpeakingBar } from "@/components/domain/ai-speaking/SpeakingBar";
import { SessionControlsBar } from "@/components/domain/ai-speaking/SessionControlsBar";
import { EmptyStateCard } from "@/components/domain/ai-speaking/EmptyStateCard";
import { ErrorBanner } from "@/components/domain/ai-speaking/ErrorBanner";
import { TranscriptEditor } from "@/components/domain/ai-speaking/TranscriptEditor";
import { TutorIdentity } from "@/components/domain/ai-speaking/TutorIdentity";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useConversation } from "@/hooks/useConversation";
import { useAppStore } from "@/store/useAppStore";
import { SCENARIOS } from "@/data/scenarios";
import { DIFFICULTY_LABEL, type Scenario } from "@/types/conversation";
import { cn } from "@/lib/utils";
import { useSessionGoals } from "@/features/goals/useSessionGoals";
import { GoalsChecklist } from "@/features/goals/GoalsChecklist";
import { useActiveSession } from "@/features/history/useActiveSession";
import { finishSession } from "@/features/history/finishSession";

const RECORDER_ERROR_COPY: Record<string, { title: string; description: string }> = {
  "permission-denied": {
    title: "Izin mikrofon ditolak",
    description: "Aktifkan akses mikrofon di pengaturan browser untuk mulai bicara.",
  },
  "no-microphone": {
    title: "Mikrofon tidak ditemukan",
    description: "Pastikan perangkatmu punya mikrofon yang terhubung dan aktif.",
  },
  unsupported: {
    title: "Pengenalan suara tidak didukung",
    description: "Browser ini tidak mendukung pengenalan suara. Ketik pesanmu di kolom bawah.",
  },
  "recognition-failed": {
    title: "Pengenalan suara gagal",
    description: "Coba rekam ulang, atau ketik pesanmu langsung di kolom teks.",
  },
};

export function AiSpeakingSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setLastAiScenario = useAppStore((s) => s.setLastAiScenario);

  // Deep-link support: Home's "Today's Practice" card links here with
  // ?scenario=<id> so tapping it jumps straight into speaking instead of
  // back to the picker.
  const [scenario, setScenario] = useState<Scenario | null>(() => {
    const requested = searchParams.get("scenario");
    return SCENARIOS.find((s) => s.id === requested) ?? null;
  });
  const [draft, setDraft] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);

  const recorder = useSpeechRecognition();
  const conversation = useConversation(scenario);
  const goals = useSessionGoals(scenario ?? SCENARIOS[0], conversation.messages);
  const activeSession = useActiveSession(scenario?.id, conversation.messages);

  useEffect(() => {
    if (scenario) setLastAiScenario(scenario.id);
    // only track on mount / when scenario actually changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  const isBusy = conversation.status === "thinking";
  const avgLevel = recorder.levels.length
    ? recorder.levels.reduce((a, b) => a + b, 0) / recorder.levels.length
    : 0;

  // Scroll only when visible content actually changes height — a new
  // message, or the typing indicator mounting — not on every status
  // transition (thinking → speaking → idle), which used to fire 2-3
  // redundant scrolls per turn for content that never moved.
  const isThinking = conversation.status === "thinking";
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.messages.length, isThinking]);

  // keep the editable transcript in sync with what's being heard live —
  // never auto-sent, the user still has to press Send themselves.
  useEffect(() => {
    if (recorder.state === "listening" || recorder.state === "finished") {
      setDraft(recorder.liveTranscript);
    }
  }, [recorder.liveTranscript, recorder.state]);

  async function handleMicPress() {
    if (recorder.state === "idle" || recorder.state === "error" || recorder.state === "finished") {
      recorder.resetError();
      await recorder.start();
      return;
    }
    if (recorder.state === "listening") {
      await recorder.stop();
    }
  }

  function handleSend() {
    if (!draft.trim() || isBusy) return;
    conversation.sendMessage(draft);
    setDraft("");
    recorder.restart();
  }

  function handleNewConversation() {
    conversation.clear();
    recorder.restart();
    setDraft("");
    setScenario(null);
    activeSession.clear();
  }

  function handleFinishSession() {
    if (!scenario || !activeSession.startedAt.current) return;
    const entry = finishSession({
      scenario,
      messages: conversation.messages,
      startedAt: activeSession.startedAt.current,
    });
    navigate(`/ringkasan/${entry.id}`);
  }

  // Alt+R retry, Alt+Backspace clear, Space to toggle mic (ignored while typing)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (event.altKey && event.key.toLowerCase() === "r" && conversation.error) {
        event.preventDefault();
        conversation.retryLast();
      }
      if (event.altKey && event.key === "Backspace" && conversation.messages.length > 0) {
        event.preventDefault();
        conversation.clear();
      }
      if (event.code === "Space" && !isTyping && recorder.isSupported && !isBusy && scenario) {
        event.preventDefault();
        handleMicPress();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.error, conversation.messages.length, isBusy, recorder.state, scenario]);

  function handlePickScenario(picked: Scenario) {
    setScenario(picked);
  }

  const recorderErrorCopy = recorder.errorKind ? RECORDER_ERROR_COPY[recorder.errorKind] : null;

  return (
    <AppShell>
      <TopBar
        title="Latihan Bicara AI"
        subtitle={
          scenario
            ? `${scenario.icon} ${scenario.title} · ${DIFFICULTY_LABEL[scenario.difficulty]} · ~${scenario.estimatedMinutes} mnt`
            : "Pilih skenario untuk mulai"
        }
        onBack={() => navigate("/pilih-mode")}
      />

      {scenario && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <TutorIdentity size="sm" />
          <div className="flex items-center gap-1.5">
            <SessionControlsBar
              hasMessages={conversation.messages.length > 0}
              canRetry={conversation.status === "error"}
              onRetry={conversation.retryLast}
              onClear={conversation.clear}
              onNewConversation={handleNewConversation}
              onDownload={conversation.downloadTranscript}
            />
            {conversation.messages.length >= 2 && (
              <Button size="sm" onClick={handleFinishSession} disabled={isBusy}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
              </Button>
            )}
          </div>
        </div>
      )}

      {scenario && (
        <div className="mb-3">
          <GoalsChecklist scenario={scenario} completedIds={goals.completedIds} />
        </div>
      )}

      {recorderErrorCopy && (
        <ErrorBanner icon={MicOff} title={recorderErrorCopy.title} description={recorderErrorCopy.description} />
      )}

      {conversation.error && (
        <ErrorBanner
          title="Tutor gagal merespons"
          description={conversation.error.message}
          actionLabel="Coba lagi"
          onAction={conversation.retryLast}
        />
      )}

      <div className="flex-1 overflow-y-auto pb-3">
        {!scenario ? (
          <EmptyStateCard onPickScenario={handlePickScenario} />
        ) : (
          <AnimatePresence initial={false}>
            {conversation.messages.map((message, i) => (
              <div
                key={message.id}
                className={cn(message.role === "user" && i > 0 ? "mt-5" : "mt-1.5")}
              >
                <ChatBubble
                  message={message}
                  scenarioId={scenario.id}
                  isSpeaking={conversation.speakingId === message.id}
                  onReplay={conversation.replay}
                  onRetry={message.failed ? conversation.retryLast : undefined}
                />
              </div>
            ))}
          </AnimatePresence>
        )}
        {conversation.status === "thinking" && (
          <div className="mt-1.5">
            <TypingIndicator />
          </div>
        )}
        <div ref={listEndRef} />
      </div>

      {scenario && (
        <div
          className="sticky bottom-0 -mx-5 border-t border-border bg-background/95 px-5 pt-3 backdrop-blur sm:-mx-8 sm:px-8"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <SpeakingBar visible={conversation.status === "speaking"} onStop={conversation.stopTutorSpeaking} />

          {recorder.state === "listening" && (
            <div className="mb-2 flex items-center justify-center gap-3">
              <span className="text-xs font-semibold tabular-nums text-danger">
                {String(Math.floor(recorder.seconds / 60)).padStart(2, "0")}:
                {String(recorder.seconds % 60).padStart(2, "0")}
              </span>
              <AudioWaveform mode="live" levels={recorder.levels} tone="danger" className="flex-1" />
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <MicButton
              state={recorder.state}
              levelAvg={avgLevel}
              disabled={isBusy || conversation.status === "speaking"}
              onPress={handleMicPress}
            />
            <div className="flex items-center gap-2">
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Space = rekam · Alt+R = coba lagi · Alt+Backspace = hapus percakapan
              </p>
              {draft && recorder.state !== "listening" && (
                <button
                  type="button"
                  onClick={() => {
                    recorder.restart();
                    setDraft("");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3" /> Rekam ulang
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <TranscriptEditor
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              disabled={isBusy || recorder.state === "listening"}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
