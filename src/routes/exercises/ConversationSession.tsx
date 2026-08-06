import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Languages, Play, SearchX, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/domain/EmptyState";
import { DialoguePracticeButton } from "@/features/dialogue-practice/DialoguePracticeButton";
import { conversationTopics } from "@/data/conversationTopics";
import { speakArabic } from "@/lib/speech";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function ConversationSession() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const addHistoryEntry = useAppStore((state) => state.addHistoryEntry);
  const topic = conversationTopics.find((item) => item.id === topicId);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completedLines, setCompletedLines] = useState<Set<string>>(new Set());
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!topic) return;
    if (completedLines.size === topic.lines.length && completedLines.size > 0 && !loggedRef.current) {
      loggedRef.current = true;
      addHistoryEntry({ kind: "percakapan", topicTitle: topic.title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedLines]);

  if (!topic) {
    return (
      <AppShell>
        <TopBar title="Percakapan" onBack={() => navigate("/percakapan/setup")} />
        <EmptyState
          icon={SearchX}
          title="Situasi tidak ditemukan"
          description="Sesi ini mungkin sudah dihapus atau tautannya tidak valid."
          actionLabel="Pilih situasi lain"
          onAction={() => navigate("/percakapan/setup")}
        />
      </AppShell>
    );
  }

  const [roleA, roleB] = topic.roles;
  const doneCount = completedLines.size;

  function playAll() {
    topic!.lines.forEach((line, i) => {
      window.setTimeout(() => speakArabic(line.arabic), i * 1800);
    });
  }

  function markListened(lineId: string) {
    setCompletedLines((prev) => new Set(prev).add(lineId));
  }

  return (
    <AppShell>
      <TopBar
        title={topic.title}
        subtitle={`${roleA.label} · ${roleB.label} · ${doneCount}/${topic.lines.length} selesai`}
        onBack={() => navigate("/percakapan/setup")}
        actions={
          <>
            <Button
              variant={showTranslation ? "primary" : "secondary"}
              size="icon"
              aria-pressed={showTranslation}
              aria-label="Terjemahkan"
              onClick={() => setShowTranslation((v) => !v)}
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Button size="icon" aria-label="Putar semua" onClick={playAll}>
              <Play className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <Progress value={(doneCount / topic.lines.length) * 100} />
      </div>

      <div className="space-y-4 pb-4">
        {topic.lines.map((line, i) => {
          const isRoleA = line.roleId === roleA.id;
          const role = isRoleA ? roleA : roleB;
          return (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn("flex flex-col", isRoleA ? "items-end" : "items-start")}
            >
              <p
                className={cn(
                  "mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide",
                  isRoleA ? "text-role-a" : "text-role-b",
                )}
              >
                {role.label}
              </p>
              <div className="flex items-end gap-2">
                {!isRoleA && (
                  <Avatar>
                    <AvatarFallback className="bg-role-b/15 text-role-b">{role.label[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-lg px-4 py-3 shadow-resting",
                    isRoleA ? "bg-role-a text-role-a-foreground" : "bg-surface text-foreground",
                  )}
                >
                  <p lang="ar" className="font-arabic text-lg leading-relaxed">
                    {line.arabic}
                  </p>
                  {showTranslation && (
                    <p className={cn("mt-1 text-xs", isRoleA ? "opacity-80" : "text-muted-foreground")}>
                      {line.translation}
                    </p>
                  )}
                </div>
                {isRoleA && (
                  <Avatar>
                    <AvatarFallback className="bg-role-a/15 text-role-a">{role.label[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className={cn("mt-1.5 flex items-center gap-2", isRoleA ? "pr-10" : "pl-10")}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    speakArabic(line.arabic);
                    markListened(line.id);
                  }}
                >
                  <Volume2 className="h-3 w-3" /> Dengar
                </Button>
                <DialoguePracticeButton targetText={line.arabic} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
