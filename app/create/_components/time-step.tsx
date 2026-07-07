"use client";

import { Slider } from "radix-ui";
import {
  TIME_MAX,
  TIME_MIN,
  TIME_MIN_DURATION,
  formatHour,
  formatTimeRange,
  periodLabel,
} from "@/lib/time";

interface TimeStepProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

// 하루의 하늘색: 새벽 → 낮 → 노을 → 밤
const SKY_GRADIENT =
  "linear-gradient(90deg,#F5EEDD 0%,#DCE8F0 22%,#ECDCEA 40%,#F5CFA6 60%,#DE8E62 73%,#4B4F7C 88%,#2C3054 100%)";

const pct = (v: number) => ((v - TIME_MIN) / (TIME_MAX - TIME_MIN)) * 100;

export function TimeStep({ value, onChange }: TimeStepProps) {
  const [start, end] = value;

  return (
    <div className="mt-2 flex flex-1 flex-col">
      <h1 className="text-[23px] leading-[1.3] font-bold tracking-[-0.02em] text-foreground">
        몇 시에
        <br />
        만날까요?
      </h1>

      <div className="mt-11 text-center">
        <p className="text-[27px] font-bold tracking-[-0.02em] text-foreground">
          {formatTimeRange(start, end)}
        </p>
        <span className="mt-2.5 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-text">
          {periodLabel(start)}
        </span>
      </div>

      <div className="mt-11 px-1">
        <Slider.Root
          value={value}
          onValueChange={(v) => onChange([v[0], v[1]])}
          min={TIME_MIN}
          max={TIME_MAX}
          step={1}
          minStepsBetweenThumbs={TIME_MIN_DURATION}
          className="relative flex h-6 w-full items-center select-none"
        >
          {/* 고른 구간만 하늘색이 선명하고, 나머지는 배경색으로 흐려진다. */}
          <Slider.Track
            className="relative h-3 w-full overflow-hidden rounded-full"
            style={{ background: SKY_GRADIENT }}
          >
            <span
              className="absolute inset-y-0 left-0 bg-background/65"
              style={{ width: `${pct(start)}%` }}
            />
            <span
              className="absolute inset-y-0 right-0 bg-background/65"
              style={{ left: `${pct(end)}%` }}
            />
          </Slider.Track>
          <Slider.Thumb
            aria-label="시작 시각"
            aria-valuetext={formatHour(start)}
            className="block size-[22px] rounded-full border-2 border-brand bg-background shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <Slider.Thumb
            aria-label="종료 시각"
            aria-valuetext={formatHour(end)}
            className="block size-[22px] rounded-full border-2 border-brand bg-background shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </Slider.Root>

        <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
          <span>오전 10</span>
          <span>낮 12</span>
          <span>오후 3</span>
          <span>오후 6</span>
          <span>밤 9</span>
          <span>밤 12</span>
        </div>
      </div>
    </div>
  );
}
