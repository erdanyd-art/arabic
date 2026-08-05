import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OptionSwitchRowProps {
  label: string;
  offLabel: string;
  onLabel: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function OptionSwitchRow({
  label,
  offLabel,
  onLabel,
  checked,
  onCheckedChange,
}: OptionSwitchRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-surface-muted px-4 py-3">
      <div>
        <Label className="text-[11px]">{label}</Label>
        <p className="text-sm font-semibold text-foreground">{checked ? onLabel : offLabel}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}
