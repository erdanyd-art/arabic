import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { AudioButton } from "@/components/ui/AudioButton";
import { sampleAyahText, surahList } from "@/data/surahList";

export function QuranReader() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const surah = surahList.find((item) => item.number === Number(surahNumber));
  const ayahs = surah ? sampleAyahText[surah.number] : undefined;

  if (!surah) {
    return (
      <PageShell>
        <p className="text-center text-sm text-slate-400">Surah tidak ditemukan.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SessionHeader
        title={surah.name}
        subtitle={`${surah.revelation} · ${surah.ayahCount} ayat`}
        onBack={() => navigate("/quran")}
      />
      {ayahs ? (
        <div className="space-y-3 pb-4">
          {ayahs.map((ayah) => (
            <div key={ayah.number} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {ayah.number}
                </span>
                <AudioButton text={ayah.arabic} size="sm" />
              </div>
              <p className="font-arabic text-right text-2xl leading-loose text-slate-900">
                {ayah.arabic}
              </p>
              <p className="mt-3 text-sm text-slate-500">{ayah.translation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Teks lengkap surah ini segera hadir. Modul ini didemonstrasikan penuh
            pada Al-Fatihah dan Al-Ikhlas.
          </p>
        </div>
      )}
    </PageShell>
  );
}
