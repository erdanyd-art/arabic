import { BookMarked, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/domain/EmptyState";
import { SCENARIOS } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { useVocabulary } from "./useVocabulary";
import { VocabularyEntryCard } from "./VocabularyEntryCard";

export function VocabularyList() {
  const navigate = useNavigate();
  const {
    items,
    totalCount,
    query,
    setQuery,
    scenarioFilter,
    setScenarioFilter,
    favoritesOnly,
    setFavoritesOnly,
    remove,
    toggleFavorite,
  } = useVocabulary();

  if (totalCount === 0) {
    return (
      <EmptyState
        icon={BookMarked}
        title="Catatan kosakatamu masih kosong"
        description="Kata-kata baru yang kamu pelajari akan muncul di sini, sekali disimpan dari evaluasi tutor."
        actionLabel="Mulai Bicara"
        onAction={() => navigate("/bicara-ai")}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kata atau arti..."
            className="pl-9"
            aria-label="Cari kosakata"
          />
        </div>
        <Button
          type="button"
          variant={favoritesOnly ? "primary" : "secondary"}
          size="icon"
          onClick={() => setFavoritesOnly((v) => !v)}
          aria-label="Tampilkan favorit saja"
          aria-pressed={favoritesOnly}
        >
          <Star className={cn("h-4 w-4", favoritesOnly && "fill-current")} />
        </Button>
      </div>

      <Select value={scenarioFilter} onValueChange={(v) => setScenarioFilter(v as typeof scenarioFilter)}>
        <SelectTrigger className="mt-2 h-9 text-xs">
          <SelectValue placeholder="Semua skenario" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua skenario</SelectItem>
          {SCENARIOS.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.icon} {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-3 flex-1">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Tidak ada kosakata yang cocok.</p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((entry) => (
              <VocabularyEntryCard
                key={entry.id}
                entry={entry}
                onToggleFavorite={toggleFavorite}
                onRemove={remove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
