import { MessagesSquare, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/domain/EmptyState";
import { SCENARIOS } from "@/data/scenarios";
import { cn } from "@/lib/utils";
import { useExpressions } from "./useExpressions";
import { ExpressionCard } from "./ExpressionCard";

export function ExpressionList() {
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
  } = useExpressions();

  if (totalCount === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Belum ada ungkapan yang kamu simpan"
        description="Kalimat tutor yang kamu bookmark saat latihan akan tersimpan di sini untuk dilihat lagi kapan saja."
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
            placeholder="Cari ungkapan atau terjemahan..."
            className="pl-9"
            aria-label="Cari ungkapan"
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
          <p className="py-12 text-center text-sm text-muted-foreground">Tidak ada ungkapan yang cocok.</p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((entry) => (
              <ExpressionCard key={entry.id} entry={entry} onToggleFavorite={toggleFavorite} onRemove={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
