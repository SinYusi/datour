import Link from "next/link";
import { getRegionById } from "@/lib/regions";
import { getMoodById } from "@/lib/moods";
import { generateCourse } from "@/lib/course-engine";
import { saveCourse } from "@/lib/courses";
import { CourseResult } from "@/components/course/course-result";

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
  const course = await generateCourse(region, moodLabels);

  // 저장은 부가 기능이라 실패해도 결과는 보여준다 (공유 버튼만 숨김).
  let shareId: string | null = null;
  try {
    shareId = await saveCourse(region.id, moodIds, course);
  } catch (e) {
    console.error("코스 저장 실패 (공유 비활성):", e);
  }

  return (
    <CourseResult
      course={course}
      region={region}
      moodLabels={moodLabels}
      shareId={shareId}
    />
  );
}
