import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { surahList } from "@/data/surahList";

export function QuranList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = surahList.filter((surah) =>
    surah.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageShell>
      <SessionHeader title="Baca Al-Quran" onBack={() => navigate("/pilih-mode")} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari nama surah..."
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
      />
      <div className="space-y-2 pb-4">
        {filtered.map((surah) => (
          <button
            key={surah.number}
            type="button"
            onClick={() => navigate(`/quran/${surah.number}`)}
            className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {surah.number}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{surah.name}</p>
              <p className="text-xs text-slate-400">
                {surah.revelation} · {surah.ayahCount} ayat
              </p>
            </div>
            <span className="font-arabic text-lg text-slate-500">{surah.arabicName}</span>
          </button>
        ))}
      </div>
    </PageShell>
  );
}
