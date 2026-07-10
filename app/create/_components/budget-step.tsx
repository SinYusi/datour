import { CircleCheck, Coins, Sparkles, Wallet, type LucideIcon } from "lucide-react";
import { BUDGETS, type Budget } from "@/lib/budgets";

const BUDGET_ICON: Record<string, LucideIcon> = {
  light: Coins,
  moderate: Wallet,
  special: Sparkles,
};

interface BudgetStepProps {
  selected: Budget | null;
  onSelect: (budget: Budget) => void;
}

export function BudgetStep({ selected, onSelect }: BudgetStepProps) {
  return (
    <div className="mt-2 flex flex-1 flex-col">
      <h1 className="text-[23px] leading-[1.3] font-bold tracking-[-0.02em] text-foreground">
        예산은
        <br />
        어느 정도로?
      </h1>

      <div className="mt-6 flex flex-col gap-2.5">
        {BUDGETS.map((budget) => {
          const Icon = BUDGET_ICON[budget.id];
          const active = selected?.id === budget.id;
          return (
            <button
              key={budget.id}
              type="button"
              onClick={() => onSelect(budget)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-2xl p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                active
                  ? "border-2 border-brand bg-brand/5"
                  : "border border-border hover:bg-muted/50"
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${
                  active ? "bg-brand text-brand-fg" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-[19px]" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-foreground">
                  {budget.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {budget.description}
                </span>
              </span>
              {active && (
                <CircleCheck className="size-5 shrink-0 text-brand" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
