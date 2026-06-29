import { Camera, Coffee, MapPin, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Stop } from "@/lib/types";

const TYPE_ICON: Record<Stop["type"], LucideIcon> = {
  식사: UtensilsCrossed,
  카페: Coffee,
  액티비티: Camera,
};

interface StopCardProps {
  stop: Stop;
  active?: boolean;
  onSelect?: () => void;
}

export function StopCard({ stop, active = false, onSelect }: StopCardProps) {
  const Icon = TYPE_ICON[stop.type];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`w-full rounded-2xl p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        active
          ? "border-2 border-brand bg-brand/5"
          : "border border-border bg-card hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${
            active ? "bg-brand text-brand-fg" : "bg-brand/10 text-brand-text"
          }`}
        >
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className={`text-[11px] font-medium ${active ? "text-brand-text" : "text-muted-foreground"}`}
          >
            {stop.order}번째 · {stop.type}
          </p>
          <p className="truncate text-[15px] font-bold text-foreground">
            {stop.place_name}
          </p>
        </div>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
        {stop.reason}
      </p>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
        <MapPin className="size-3 shrink-0" aria-hidden />
        {stop.address}
      </p>
    </button>
  );
}
