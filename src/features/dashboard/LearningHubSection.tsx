import { BookMarked, History, Layers, MessageSquareText, PlayCircle, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getScenario } from "@/data/scenarios";
import { formatShortDate } from "@/lib/date";
import { SessionStorage } from "@/storage/SessionStorage";
import { useVocabulary } from "@/features/vocabulary/useVocabulary";
import { useExpressions } from "@/features/expressions/useExpressions";
import { useHistory } from "@/features/history/useHistory";

interface HubTile {
  key: string;
  icon: LucideIcon;
  title: string;
  /** Plain Indonesian caption — always shown when there's no Arabic peek. */
  meta: string;
  /** An actual saved word/sentence, when there is one — rendered as real Arabic, not a stat. */
  arabicPeek?: string;
  path: string;
}

function Tile({ tile, onOpen }: { tile: HubTile; onOpen: (path: string) => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={() => onOpen(tile.path)}
      className="flex flex-col items-start gap-2.5 rounded-2xl bg-surface-muted p-4 text-left transition-colors hover:bg-border/40"
    >
      <tile.icon className="h-4 w-4 text-muted-foreground" />
      <div className="min-w-0 w-full">
        <p className="text-sm font-semibold text-foreground">{tile.title}</p>
        {tile.arabicPeek ? (
          <p lang="ar" dir="rtl" className="font-arabic text-left text-sm text-muted-foreground truncate">
            {tile.arabicPeek}
          </p>
        ) : (
          <p className="truncate text-xs text-muted-foreground">{tile.meta}</p>
        )}
      </div>
    </motion.button>
  );
}

/**
 * "Continue Learning" — a small grid of notebook pages, not a settings
 * list: each tile peeks at real saved content (an actual word, an actual
 * sentence) rather than a bare count. Reuses the same data hooks as the
 * standalone Notebook/History/Review routes.
 */
export function LearningHubSection() {
  const navigate = useNavigate();
  const { items: vocab, totalCount: vocabCount } = useVocabulary();
  const { items: expressions, totalCount: expressionCount } = useExpressions();
  const { entries } = useHistory();
  const draft = SessionStorage.get();

  const tiles: HubTile[] = [];

  if (draft && draft.messages.length > 0) {
    const scenario = getScenario(draft.scenarioId);
    tiles.push({
      key: "continue",
      icon: PlayCircle,
      title: `Lanjutkan ${scenario.title}`,
      meta: `${draft.messages.length} pesan terkirim`,
      path: `/bicara-ai?scenario=${scenario.id}`,
    });
  } else if (entries.length > 0) {
    const latest = entries[0];
    tiles.push({
      key: "recent",
      icon: PlayCircle,
      title: latest.scenarioTitle,
      meta: formatShortDate(latest.finishedAt),
      path: `/riwayat/${latest.id}`,
    });
  }

  if (vocabCount > 0) {
    tiles.push({
      key: "vocab",
      icon: BookMarked,
      title: "Kosakata Tersimpan",
      meta: "",
      arabicPeek: vocab[0]?.arabic,
      path: "/kosakata-tersimpan",
    });
  }

  if (expressionCount > 0) {
    tiles.push({
      key: "expressions",
      icon: MessageSquareText,
      title: "Ungkapan Tersimpan",
      meta: "",
      arabicPeek: expressions[0]?.arabic,
      path: "/ekspresi-tersimpan",
    });
  }

  if (entries.length > 0) {
    tiles.push({
      key: "history",
      icon: History,
      title: "Riwayat Percakapan",
      meta: `${entries.length} sesi tersimpan`,
      path: "/riwayat",
    });
  }

  if (vocabCount + expressionCount > 0) {
    tiles.push({
      key: "review",
      icon: Layers,
      title: "Ulas Kosakata",
      meta: "Latihan flashcard singkat",
      path: "/ulas",
    });
  }

  if (tiles.length === 0) return null;

  return (
    <section>
      <p className="mb-3 text-[13px] font-semibold text-muted-foreground">Lanjutkan Belajar</p>
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile) => (
          <Tile key={tile.key} tile={tile} onOpen={navigate} />
        ))}
      </div>
    </section>
  );
}
