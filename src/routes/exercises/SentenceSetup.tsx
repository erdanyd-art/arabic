import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TopicCard } from "@/components/ui/TopicCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { sentenceTopics } from "@/data/sentenceTopics";
import { LEVEL_LABEL, type Dialect, type Level, type VoiceGender } from "@/lib/types";

export function SentenceSetup() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>("pemula");
  const [dialect, setDialect] = useState<Dialect>("formal");
  const [gender, setGender] = useState<VoiceGender>("pria");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = sentenceTopics.filter((topic) => topic.level === level);

  function pickRandom() {
    if (topics.length === 0) return;
    const random = topics[Math.floor(Math.random() * topics.length)];
    setSelectedTopic(random.id);
  }

  return (
    <PageShell>
      <SessionHeader title="Latihan Kalimat" />
      <p className="mb-5 text-center text-sm text-slate-500">
        Pilih topik atau buat kalimat sendiri, lalu berlatih pengucapan kalimat Arab.
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
            { value: "preset", label: "Pilih Topik" },
            { value: "custom", label: "Buat Sendiri" },
          ]}
          value="preset"
          onChange={() => {}}
        />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Topik ({LEVEL_LABEL[level]})
        </p>
        <button
          type="button"
          onClick={pickRandom}
          className="text-xs font-semibold text-indigo-600"
        >
          ✳ Pilih Topik Acak
        </button>
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
              hint={topic.hint}
              selected={selectedTopic === topic.id}
              onClick={() => setSelectedTopic(topic.id)}
            />
          ))}
        </div>
      )}

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Aksen</p>
      <div className="mb-4">
        <SegmentedControl
          options={[
            { value: "formal", label: "Formal (Fusha)" },
            { value: "harian", label: "Sehari-hari (Ammiyah)" },
          ]}
          value={dialect}
          onChange={setDialect}
        />
      </div>

      <div className="mb-6">
        <SegmentedControl
          options={[
            { value: "pria", label: "Laki-laki" },
            { value: "wanita", label: "Perempuan" },
          ]}
          value={gender}
          onChange={setGender}
        />
      </div>

      <PrimaryButton
        tone="amber"
        disabled={!selectedTopic}
        onClick={() => navigate(`/kalimat/sesi/${selectedTopic}`)}
      >
        Mulai Latihan
      </PrimaryButton>
    </PageShell>
  );
}
