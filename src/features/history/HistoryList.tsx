import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/domain/EmptyState";
import { useHistory } from "./useHistory";
import { HistorySessionCard } from "./HistorySessionCard";

export function HistoryList() {
  const navigate = useNavigate();
  const { entries } = useHistory();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Perjalanan Bahasa Arab-mu dimulai dari sini"
        description="Selesaikan satu percakapan dan sesi itu akan tersimpan di sini — jadi kamu bisa lihat lagi seberapa jauh kamu sudah berkembang."
        actionLabel="Mulai Bicara"
        onAction={() => navigate("/bicara-ai")}
      />
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {entries.map((entry) => (
        <HistorySessionCard key={entry.id} entry={entry} onOpen={(id) => navigate(`/riwayat/${id}`)} />
      ))}
    </div>
  );
}
