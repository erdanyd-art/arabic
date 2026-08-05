import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/domain/EmptyState";

export function ReviewDeckEmptyState() {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={Layers}
      title="Belum ada yang bisa diulas"
      description="Kata dan ungkapan yang kamu simpan saat latihan bicara akan muncul di sini sebagai flashcard."
      actionLabel="Mulai Bicara"
      onAction={() => navigate("/bicara-ai")}
    />
  );
}
