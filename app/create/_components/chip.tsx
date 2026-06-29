import { Check } from "lucide-react";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** 지역 인기 칩 · 분위기 칩 공용. 선택 시 브랜드 채움 + 체크. */
export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        selected
          ? "bg-brand font-medium text-brand-fg"
          : "border border-border text-foreground hover:bg-muted"
      }`}
    >
      {selected && <Check className="size-3.5" aria-hidden />}
      {label}
    </button>
  );
}
