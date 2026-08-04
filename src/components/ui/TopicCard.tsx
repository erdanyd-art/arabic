interface TopicCardProps {
  title: string;
  arabicTitle?: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
}

export function TopicCard({ title, arabicTitle, hint, selected, onClick }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 bg-white p-4 text-left transition-colors ${
        selected
          ? "border-amber-400 bg-amber-50"
          : "border-transparent hover:border-slate-200"
      }`}
    >
      <p className="font-semibold text-slate-800">
        {title}
        {arabicTitle && <span className="font-arabic text-slate-500"> / {arabicTitle}</span>}
      </p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </button>
  );
}
