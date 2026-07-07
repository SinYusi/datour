import Link from "next/link";
import { getRegionById } from "@/lib/regions";
import { getMoodById } from "@/lib/moods";
import { generateCourse } from "@/lib/course-engine";
import { saveCourse } from "@/lib/courses";
import {
  TIME_DEFAULT,
  TIME_MAX,
  TIME_MIN,
  TIME_MIN_DURATION,
  formatTimeRange,
  periodLabel,
  periodShort,
} from "@/lib/time";
import { BUDGETS, getBudgetById } from "@/lib/budgets";
import { CourseResult } from "@/components/course/course-result";

function parseHour(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= TIME_MIN && n <= TIME_MAX ? n : fallback;
}

interface ResultPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 중복 쿼리 키는 배열로 들어올 수 있어 첫 값으로 정규화한다.
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const sp = await searchParams;
  const regionId = first(sp.region);
  const region = regionId ? getRegionById(regionId) : undefined;
  const moodIds = first(sp.moods)?.split(",").filter(Boolean) ?? [];
  const moods = moodIds.map(getMoodById);

  // 알 수 없는 mood id를 조용히 버리지 않고, 하나라도 무효하면 잘못된 접근으로 처리한다.
  if (!region || moods.length === 0 || moods.some((m) => !m)) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          조건이 올바르지 않아요. 다시 골라주세요.
        </p>
        <Link
          href="/create"
          className="text-sm font-medium text-brand-text hover:underline"
        >
          조건 고르기
        </Link>
      </main>
    );
  }

  const moodLabels = moods.map((m) => m!.label);

  // 시간대·예산은 부가 조건 — 값이 없거나 조작돼도 범위·최소 지속시간을 항상 보장한다.
  let start = parseHour(first(sp.start), TIME_DEFAULT[0]);
  start = Math.min(start, TIME_MAX - TIME_MIN_DURATION);
  let end = parseHour(first(sp.end), TIME_DEFAULT[1]);
  end = Math.min(Math.max(end, start + TIME_MIN_DURATION), TIME_MAX);
  const budget =
    getBudgetById(first(sp.budget) ?? "") ??
    BUDGETS.find((b) => b.id === "moderate")!;

  const timeText = `${periodLabel(start)} (${formatTimeRange(start, end)})`;
  const budgetText = `${budget.label} (${budget.description})`;
  const course = await generateCourse(region, moodLabels, timeText, budgetText);

  // 저장은 부가 기능이라 실패해도 결과는 보여준다 (공유 버튼만 숨김).
  let shareId: string | null = null;
  try {
    shareId = await saveCourse(region.id, moodIds, course, start, end, budget.id);
  } catch (e) {
    console.error("코스 저장 실패 (공유 비활성):", e);
  }

  return (
    <CourseResult
      course={course}
      region={region}
      moodLabels={moodLabels}
      timeLabel={periodShort(start)}
      budgetLabel={budget.label}
      shareId={shareId}
    />
  );
}
