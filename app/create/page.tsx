"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { StepProgress } from "./_components/step-progress";
import { RegionStep } from "./_components/region-step";
import type { Region } from "@/lib/regions";

const TOTAL_STEPS = 2;

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState<Region | null>(null);

  // 뒤로가기: 2단계 이상이면 이전 단계로, 1단계면 홈으로.
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
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

      <div className="flex flex-1 flex-col pt-7">
        <p className="text-xs font-medium text-brand-text">
          {step} / {TOTAL_STEPS}
        </p>
        {step === 1 ? (
          <RegionStep selected={region} onSelect={setRegion} />
        ) : (
          <div className="mt-2 flex flex-1 flex-col">
            <h1 className="text-[23px] leading-[1.3] font-bold tracking-[-0.02em] text-foreground">
              어떤 분위기로
              <br />
              즐길까요?
            </h1>
            <p className="mt-6 text-sm text-muted-foreground">
              (분위기 선택 — 다음 커밋)
            </p>
          </div>
        )}
      </div>

      {step === 1 ? (
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!region}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-colors bg-brand text-brand-fg hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-brand-disabled-fg disabled:hover:bg-brand-disabled"
        >
          다음
          <ArrowRight className="size-[18px]" />
        </button>
      ) : (
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-xl border border-border px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            이전
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-semibold text-brand-fg transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            코스 만들기
            <Sparkles className="size-4" />
          </button>
        </div>
      )}
    </main>
  );
}
