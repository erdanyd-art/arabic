import { useNavigate, useParams } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { AudioButton } from "@/components/domain/AudioButton";
import { sampleAyahText, surahList } from "@/data/surahList";

export function QuranReader() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const surah = surahList.find((item) => item.number === Number(surahNumber));
  const ayahs = surah ? sampleAyahText[surah.number] : undefined;

  if (!surah) {
    return (
      <AppShell>
        <p className="text-center text-sm text-muted-foreground">Surah tidak ditemukan.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar
        title={surah.name}
        subtitle={`${surah.revelation} · ${surah.ayahCount} ayat`}
        onBack={() => navigate("/quran")}
      />
      {ayahs ? (
        <div className="space-y-3 pb-4">
          {ayahs.map((ayah) => (
            <Card key={ayah.number} className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-muted text-xs font-bold text-success">
                  {ayah.number}
                </span>
                <AudioButton text={ayah.arabic} size="sm" />
              </div>
              <p lang="ar" className="font-arabic text-right text-2xl leading-loose text-foreground">
                {ayah.arabic}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{ayah.translation}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <Clock3 className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Teks lengkap surah ini segera hadir. Modul ini didemonstrasikan penuh pada
            Al-Fatihah dan Al-Ikhlas.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
