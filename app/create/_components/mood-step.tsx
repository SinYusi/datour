import { MOODS, type Mood } from "@/lib/moods";
import { Chip } from "./chip";

interface MoodStepProps {
  selected: Mood[];
  onToggle: (mood: Mood) => void;
}

export function MoodStep({ selected, onToggle }: MoodStepProps) {
  const isSelected = (m: Mood) => selected.some((s) => s.id === m.id);

  return (
    <div className="mt-2 flex flex-1 flex-col">
      <h1 className="text-[23px] leading-[1.3] font-bold tracking-[-0.02em] text-foreground">
        어떤 분위기로
        <br />
        즐길까요?
      </h1>
      <p className="mt-2.5 text-sm text-muted-foreground">여러 개 골라도 좋아요.</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {MOODS.map((m) => (
          <Chip
            key={m.id}
            label={m.label}
            selected={isSelected(m)}
            onClick={() => onToggle(m)}
          />
        ))}
      </div>
    </div>
  );
}
