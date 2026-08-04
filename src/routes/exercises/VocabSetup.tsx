import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TopicCard } from "@/components/ui/TopicCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { vocabTopics } from "@/data/vocabTopics";
import { LEVEL_LABEL, type Dialect, type Level } from "@/lib/types";

export function VocabSetup() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>("pemula");
  const [dialect, setDialect] = useState<Dialect>("formal");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = vocabTopics.filter((topic) => topic.level === level);

  return (
    <PageShell>
      <SessionHeader title="Latihan Kosakata" />
      <p className="mb-5 text-center text-sm text-slate-500">
        Pilih topik kosakata Arab. Tebak arti tiap kata dengan kuis pilihan ganda.
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
            {lvl === "pemula" ? "Mubtadi — Pemula" : LEVEL_LABEL[lvl]}
          </option>
        ))}
      </select>

      <div className="mb-5">
        <SegmentedControl
          options={[
            { value: "preset", label: "Pilih Topik" },
            { value: "custom", label: "Buat Sendiri" },
          ]}
          value="preset"
          onChange={() => {}}
        />
      </div>

      {topics.length === 0 ? (
        <p className="mb-5 rounded-xl bg-white p-4 text-center text-sm text-slate-400">
          Belum ada topik untuk level ini.
        </p>
      ) : (
        <div className="mb-5 grid grid-cols-2 gap-3">
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

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Dialek (untuk audio opsional)
      </p>
      <div className="mb-6">
        <SegmentedControl
          options={[
            { value: "formal", label: "Formal (Fusha)" },
            { value: "harian", label: "Sehari-hari (Ammiyah)" },
          ]}
          value={dialect}
          onChange={setDialect}
        />
      </div>

      <PrimaryButton
        tone="amber"
        disabled={!selectedTopic}
        onClick={() => navigate(`/kosakata/sesi/${selectedTopic}`)}
      >
        Mulai Latihan
      </PrimaryButton>
    </PageShell>
  );
}
