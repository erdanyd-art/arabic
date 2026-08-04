import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, Languages, Play } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { conversationTopics } from "@/data/conversationTopics";
import { speakArabic } from "@/lib/speech";
import { RecordButton } from "@/components/ui/RecordButton";
import { useAppStore } from "@/store/useAppStore";

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
      <PageShell>
        <p className="text-center text-sm text-slate-400">Situasi tidak ditemukan.</p>
      </PageShell>
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
    <PageShell>
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/percakapan/setup")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
          aria-label="Kembali"
        >
          ←
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-semibold text-slate-800">
            {topic.title} <span className="font-arabic text-slate-400">/ {topic.arabicTitle}</span>
          </p>
          <p className="truncate text-xs text-slate-500">
            {roleA.arabicLabel} / {roleA.label} · {roleB.arabicLabel} / {roleB.label} ·{" "}
            {doneCount}/{topic.lines.length} selesai
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          className={`flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold shrink-0 ${showTranslation ? "bg-indigo-600 text-white" : "bg-white text-slate-500 shadow-sm"}`}
        >
          <Languages className="h-3.5 w-3.5" /> Terjemahkan
        </button>
        <button
          type="button"
          onClick={playAll}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"
          aria-label="Putar semua"
        >
          <Play className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
          aria-label="Beranda"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 pb-4">
        {topic.lines.map((line) => {
          const isRoleA = line.roleId === roleA.id;
          const role = isRoleA ? roleA : roleB;
          return (
            <div key={line.id} className={`flex flex-col ${isRoleA ? "items-end" : "items-start"}`}>
              <p
                className={`mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide ${isRoleA ? "text-pink-500" : "text-indigo-500"}`}
              >
                {role.arabicLabel} / {role.label}
              </p>
              <div className="flex items-end gap-2">
                {!isRoleA && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {role.label[0]}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isRoleA ? "bg-pink-500 text-white" : "bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  <p className="font-arabic text-lg leading-relaxed">{line.arabic}</p>
                  {showTranslation && (
                    <p className={`mt-1 text-xs ${isRoleA ? "text-pink-100" : "text-slate-400"}`}>
                      {line.translation}
                    </p>
                  )}
                </div>
                {isRoleA && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                    {role.label[0]}
                  </div>
                )}
              </div>
              <div className={`mt-1.5 flex gap-2 ${isRoleA ? "pr-10" : "pl-10"}`}>
                <button
                  type="button"
                  onClick={() => {
                    speakArabic(line.arabic);
                    markListened(line.id);
                  }}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  🔊 Dengar
                </button>
                <RecordButton />
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
