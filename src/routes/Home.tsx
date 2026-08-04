import { BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/ui/PageShell";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAppStore } from "@/store/useAppStore";

const KIND_LABEL: Record<string, string> = {
  kosakata: "Kosakata",
  kalimat: "Kalimat",
  percakapan: "Percakapan",
  quran: "Al-Quran",
  umrah: "Panduan Umrah",
  haji: "Panduan Haji",
};

export function Home() {
  const navigate = useNavigate();
  const history = useAppStore((state) => state.history);

  return (
    <PageShell>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Lisan Coach</h1>
          <p className="text-sm text-slate-500">Latihan pengucapan Bahasa Arab</p>
        </div>
      </div>

      <PrimaryButton onClick={() => navigate("/pilih-mode")}>
        + Latihan Baru
      </PrimaryButton>

      <div className="mt-10 flex-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BookOpen className="h-7 w-7 text-slate-300" />
            </div>
            <p className="font-medium text-slate-600">Belum ada sesi latihan</p>
            <p className="text-sm text-slate-400">Klik "Latihan Baru" untuk mulai</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Riwayat sesi
            </p>
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{entry.topicTitle}</p>
                  <p className="text-xs text-slate-400">
                    {KIND_LABEL[entry.kind]} ·{" "}
                    {new Date(entry.completedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                {entry.total !== undefined && (
                  <span className="text-sm font-semibold text-indigo-600">
                    {entry.score}/{entry.total}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
