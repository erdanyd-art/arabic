import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TopicCard } from "@/components/ui/TopicCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { conversationTopics } from "@/data/conversationTopics";
import { LEVEL_LABEL, type Level } from "@/lib/types";

export function ConversationSetup() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>("pemula");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = conversationTopics.filter((topic) => topic.level === level);

  return (
    <PageShell>
      <SessionHeader title="Latihan Percakapan" />
      <p className="mb-5 text-center text-sm text-slate-500">
        Dialog dua orang dalam berbagai situasi Bahasa Arab. Kamu bisa berlatih
        berperan sebagai salah satunya.
      </p>

      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        Level
      </label>
      <select
        value={level}
        onChange={(event) => {
          setLevel(event.target.value as Level);
          setSelectedTopic(null);
        }}
        className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
      >
        {(Object.keys(LEVEL_LABEL) as Level[]).map((lvl) => (
          <option key={lvl} value={lvl}>
            {LEVEL_LABEL[lvl]}
          </option>
        ))}
      </select>

      <div className="mb-5">
        <SegmentedControl
          options={[
            { value: "preset", label: "Pilih Situasi" },
            { value: "custom", label: "Buat Sendiri" },
          ]}
          value="preset"
          onChange={() => {}}
        />
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Situasi ({LEVEL_LABEL[level]})
      </p>
      {topics.length === 0 ? (
        <p className="mb-5 rounded-xl bg-white p-4 text-center text-sm text-slate-400">
          Belum ada situasi untuk level ini.
        </p>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              arabicTitle={topic.arabicTitle}
              hint={topic.hint}
              selected={selectedTopic === topic.id}
              onClick={() => setSelectedTopic(topic.id)}
            />
          ))}
        </div>
      )}

      <PrimaryButton
        tone="amber"
        disabled={!selectedTopic}
        onClick={() => navigate(`/percakapan/sesi/${selectedTopic}`)}
      >
        Mulai Latihan
      </PrimaryButton>
    </PageShell>
  );
}
