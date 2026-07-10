"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { StepProgress } from "./_components/step-progress";
import { RegionStep } from "./_components/region-step";
import { MoodStep } from "./_components/mood-step";
import { TimeStep } from "./_components/time-step";
import { BudgetStep } from "./_components/budget-step";
import type { Region } from "@/lib/regions";
import type { Mood } from "@/lib/moods";
import type { Budget } from "@/lib/budgets";
import { TIME_DEFAULT } from "@/lib/time";

const TOTAL_STEPS = 4;

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState<Region | null>(null);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [time, setTime] = useState<[number, number]>(TIME_DEFAULT);
  const [budget, setBudget] = useState<Budget | null>(null);

  const isFirst = step === 1;
  const isLast = step === TOTAL_STEPS;

  // 현재 단계에서 다음/제출로 넘어갈 수 있는지
  const canProceed =
    step === 1
      ? region !== null
      : step === 2
        ? moods.length > 0
        : step === 4
          ? budget !== null
          : true;

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
  };

  const toggleMood = (mood: Mood) => {
    setMoods((prev) =>
      prev.some((m) => m.id === mood.id)
        ? prev.filter((m) => m.id !== mood.id)
        : [...prev, mood],
    );
  };

  // 입력값을 쿼리 파라미터(ASCII id)로 실어 결과 화면으로 이동.
  const handleSubmit = () => {
    if (!region || moods.length === 0 || !budget) return;
    const params = new URLSearchParams({
      region: region.id,
      moods: moods.map((m) => m.id).join(","),
      start: String(time[0]),
      end: String(time[1]),
      budget: budget.id,
    });
    router.push(`/result?${params.toString()}`);
  };

  const handleNext = () => {
    if (isLast) handleSubmit();
    else setStep((s) => s + 1);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-5 pb-6">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로"
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ArrowLeft className="size-[17px]" />
        </button>
        <StepProgress current={step} total={TOTAL_STEPS} />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden pt-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            <p className="text-xs font-medium text-brand-text">
              {step} / {TOTAL_STEPS}
            </p>
            {step === 1 ? (
              <RegionStep selected={region} onSelect={setRegion} />
            ) : step === 2 ? (
              <MoodStep selected={moods} onToggle={toggleMood} />
            ) : step === 3 ? (
              <TimeStep value={time} onChange={setTime} />
            ) : (
              <BudgetStep selected={budget} onSelect={setBudget} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2.5">
        {!isFirst && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl border border-border px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            이전
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-colors bg-brand text-brand-fg hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-brand-disabled-fg disabled:hover:bg-brand-disabled"
        >
          {isLast ? (
            <>
              코스 만들기
              <Sparkles className="size-4" />
            </>
          ) : (
            <>
              다음
              <ArrowRight className="size-[18px]" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
