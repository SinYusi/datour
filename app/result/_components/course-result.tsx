"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Course } from "@/lib/types";
import type { Region } from "@/lib/regions";
import { CourseMap } from "./course-map";
import { StopCard } from "./stop-card";

interface CourseResultProps {
  course: Course;
  region: Region;
  moodLabels: string[];
}

export function CourseResult({ course, region, moodLabels }: CourseResultProps) {
  const [activeId, setActiveId] = useState<string | null>(
    course.stops[0]?.place_id ?? null,
  );
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const stickyRef = useRef<HTMLDivElement>(null);

  // 지도 핀 클릭: 카드 강조 + 상단 고정 지도에 가리지 않게, sticky 아래 보이는 영역 중앙으로 스크롤.
  const handleMapSelect = (placeId: string) => {
    setActiveId(placeId);
    const card = cardRefs.current[placeId];
    if (!card) return;

    const stickyBottom = stickyRef.current?.getBoundingClientRect().bottom ?? 0;
    const cardRect = card.getBoundingClientRect();
    const available = window.innerHeight - stickyBottom;
    const targetTop = stickyBottom + (available - cardRect.height) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollBy({
      top: cardRect.top - targetTop,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6">
      {/* 지도 상단 고정: 아래 카드를 눌러도 지도 이동이 항상 보인다 */}
      <div ref={stickyRef} className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="홈으로"
            className="flex size-[30px] items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-[17px]" />
          </Link>
          <span className="text-xs text-muted-foreground">
            {region.name} · {moodLabels.join(" · ")}
          </span>
          <ThemeToggle />
        </div>

        <div className="mt-3">
          <CourseMap
            stops={course.stops}
            activeId={activeId}
            onSelect={handleMapSelect}
          />
        </div>
      </div>

      <h1 className="mt-3 text-lg font-bold tracking-[-0.02em] text-foreground">
        {course.course_title}
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        {course.summary}
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {course.stops.map((stop) => (
          <StopCard
            key={stop.place_id}
            ref={(el) => {
              cardRefs.current[stop.place_id] = el;
            }}
            stop={stop}
            active={activeId === stop.place_id}
            onSelect={() => setActiveId(stop.place_id)}
          />
        ))}
      </div>

      <Link
        href="/create"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <RefreshCw className="size-4" />
        다른 코스 만들기
      </Link>
    </main>
  );
}
