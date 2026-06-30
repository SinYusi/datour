"use client";

import { useEffect, useState } from "react";

// 엔진 단계에 대응하는 순환 메시지 (loading.tsx는 searchParams를 못 받아 지역명은 생략).
const MESSAGES = [
  "좋은 장소들을 살펴보는 중…",
  "둘에게 맞는 코스를 고르는 중…",
  "지도에 동선을 그리는 중…",
];

export default function ResultLoading() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6">
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-[3px] border-dashed border-brand motion-reduce:animate-none" />
        <svg
          className="animate-pulse text-brand motion-reduce:animate-none"
          width="42"
          height="42"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden
        >
          <path
            d="M11 52 Q25 47 39 46"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="11" cy="52" r="4.5" fill="currentColor" />
          <circle cx="25" cy="48" r="5" fill="#2BA888" />
          <path
            d="M39 46 C27 34 21 28 21 20 C21 13 28 9 34 12 C36.5 13 38 15.5 39 18 C40 15.5 41.5 13 44 12 C50 9 57 13 57 20 C57 28 51 34 39 46 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <h1 className="mt-7 text-center text-xl font-bold leading-snug tracking-[-0.02em] text-foreground">
        둘만의 코스를
        <br />
        만들고 있어요
      </h1>
      <p
        aria-live="polite"
        className="mt-3 min-h-[18px] text-center text-[13px] text-muted-foreground"
      >
        {MESSAGES[i]}
      </p>

      <div className="mt-5 flex gap-1.5">
        {MESSAGES.map((_, idx) => (
          <span
            key={idx}
            className={`size-[7px] rounded-full ${idx === i ? "bg-brand" : "bg-muted"}`}
          />
        ))}
      </div>
    </main>
  );
}
