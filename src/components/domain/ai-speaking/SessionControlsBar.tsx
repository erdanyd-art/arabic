import { useState } from "react";
import { Download, MessageSquarePlus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionControlsBarProps {
  hasMessages: boolean;
  canRetry: boolean;
  onRetry: () => void;
  onClear: () => void;
  onNewConversation: () => void;
  onDownload: (format: "md" | "txt") => void;
}

function ToolbarIconButton({
  label,
  onClick,
  icon: Icon,
  tone,
}: {
  label: string;
  onClick: () => void;
  icon: typeof Download;
  tone?: "danger";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          aria-label={label}
          className={tone === "danger" ? "text-danger hover:text-danger" : "text-muted-foreground"}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SessionControlsBar({
  hasMessages,
  canRetry,
  onRetry,
  onClear,
  onNewConversation,
  onDownload,
}: SessionControlsBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex shrink-0 items-center gap-0.5">
        {canRetry && <ToolbarIconButton label="Coba lagi (Alt+R)" onClick={onRetry} icon={RotateCcw} />}
        <ToolbarIconButton label="Percakapan baru" onClick={onNewConversation} icon={MessageSquarePlus} />
        {hasMessages && (
          <>
            <ToolbarIconButton label="Unduh percakapan (.md)" onClick={() => onDownload("md")} icon={Download} />
            <ToolbarIconButton
              label="Hapus percakapan (Alt+Backspace)"
              onClick={() => setConfirmOpen(true)}
              icon={Trash2}
              tone="danger"
            />
          </>
        )}

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus percakapan ini?</DialogTitle>
              <DialogDescription>
                Semua pesan di sesi ini akan dihapus permanen dan tidak bisa dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onClear();
                  setConfirmOpen(false);
                }}
              >
                Hapus
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
