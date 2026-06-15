import { Fragment } from "react";
import { Coffee, Footprints, UtensilsCrossed, type LucideIcon } from "lucide-react";

interface PreviewStop {
  icon: LucideIcon;
  label: string;
  /** 동선의 도착점(산책)만 강조 채움 */
  destination?: boolean;
}

const STOPS: PreviewStop[] = [
  { icon: UtensilsCrossed, label: "식사" },
  { icon: Coffee, label: "카페" },
  { icon: Footprints, label: "산책", destination: true },
];

export function CoursePreview() {
  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <div className="flex items-center">
        {STOPS.map((stop, i) => (
          <Fragment key={stop.label}>
            {i > 0 && (
              <div
                aria-hidden
                className="mb-5 flex-1 border-t border-dashed border-brand-line"
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={
                  stop.destination
                    ? "flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg"
                    : "flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
                }
              >
                <stop.icon className="size-4" />
              </span>
              <span
                className={
                  stop.destination
                    ? "text-[11px] font-medium text-brand-text"
                    : "text-[11px] text-muted-foreground"
                }
              >
                {stop.label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
