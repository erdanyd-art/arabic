import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { surahList } from "@/data/surahList";

export function QuranList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = surahList.filter((surah) =>
    surah.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <TopBar title="Baca Al-Quran" onBack={() => navigate("/pilih-mode")} />
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama surah..."
          className="pl-10"
          aria-label="Cari nama surah"
        />
      </div>
      <div className="space-y-2 pb-4">
        {filtered.map((surah, i) => (
          <motion.div
            key={surah.number}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.015, 0.3) }}
          >
            <Card
              className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-surface-muted"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/quran/${surah.number}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/quran/${surah.number}`)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-muted text-xs font-bold text-success">
                {surah.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{surah.name}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Badge variant="neutral" className="px-1.5 py-0.5 text-[10px]">
                    {surah.revelation}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{surah.ayahCount} ayat</span>
                </div>
              </div>
              <span lang="ar" className="font-arabic text-lg text-muted-foreground">
                {surah.arabicName}
              </span>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Tidak ada surah yang cocok dengan "{query}".
          </p>
        )}
      </div>
    </AppShell>
  );
}
