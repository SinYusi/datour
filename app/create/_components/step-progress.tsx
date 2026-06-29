interface StepProgressProps {
  /** 현재 단계 (1-based) */
  current: number;
  /** 전체 단계 수 */
  total: number;
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`${total}단계 중 ${current}단계`}
      className="flex flex-1 gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${i < current ? "bg-brand" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}
