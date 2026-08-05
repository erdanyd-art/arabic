import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      theme="system"
      toastOptions={{
        classNames: {
          toast:
            "bg-surface! text-foreground! border! border-border! shadow-floating! rounded-md! font-display!",
          description: "text-muted-foreground!",
        },
      }}
    />
  );
}
