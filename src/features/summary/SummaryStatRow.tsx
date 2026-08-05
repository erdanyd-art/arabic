import type { LucideIcon } from "lucide-react";

interface SummaryStatRowProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function SummaryStatRow({ icon: Icon, value, label }: SummaryStatRowProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-surface-muted py-3 text-center">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
