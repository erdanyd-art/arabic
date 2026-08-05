// Shared Indonesian-locale date/time formatting — previously duplicated ad
// hoc as inline `toLocaleDateString`/`toLocaleTimeString` calls in
// ChatBubble.tsx and Home.tsx; every Sprint 3 feature needs the same thing.

export function formatDate(value: string | number | Date): string {
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatShortDate(value: string | number | Date): string {
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function formatTime(value: string | number | Date): string {
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 1) return "< 1 mnt";
  if (minutes < 60) return `${minutes} mnt`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} mnt`;
}
