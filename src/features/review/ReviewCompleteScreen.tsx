import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewCompleteScreenProps {
  remembered: number;
  later: number;
  onFinish: () => void;
}

export function ReviewCompleteScreen({ remembered, later, onFinish }: ReviewCompleteScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted">
        <PartyPopper className="h-6 w-6 text-primary" />
      </div>
      <p className="font-semibold text-foreground">Ulasan selesai!</p>
      <p className="text-sm text-muted-foreground">
        {remembered} sudah hafal · {later} akan diulas lagi nanti
      </p>
      <Button className="mt-2" onClick={onFinish}>
        Kembali ke Beranda
      </Button>
    </div>
  );
}
