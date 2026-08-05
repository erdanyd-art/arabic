import { CheckCircle2 } from "lucide-react";

/** Shown when everything saved has already been marked "remembered" — a win, not an empty state, so it gets its own copy instead of reusing ReviewDeckEmptyState. */
export function ReviewAllCaughtUp() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-muted">
        <CheckCircle2 className="h-6 w-6 text-success" />
      </div>
      <p className="font-semibold text-foreground">Semua sudah kamu hafal</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Kerja bagus — semua kosakata dan ungkapan tersimpanmu sudah kamu tandai hafal. Simpan kata baru dari sesi
        berikutnya untuk terus mengulas.
      </p>
    </div>
  );
}
