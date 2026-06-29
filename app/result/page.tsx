import Link from "next/link";
import { getRegionById } from "@/lib/regions";
import { getMoodById } from "@/lib/moods";
import { generateCourse } from "@/lib/course-engine";
import { CourseResult } from "./_components/course-result";

interface ResultPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 중복 쿼리 키는 배열로 들어올 수 있어 첫 값으로 정규화한다.
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const sp = await searchParams;
  const region = first(sp.region) ? getRegionById(first(sp.region)!) : undefined;
  const moodLabels = (first(sp.moods)?.split(",") ?? [])
    .map((id) => getMoodById(id)?.label)
    .filter((label): label is string => Boolean(label));

  if (!region || moodLabels.length === 0) {
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

  const course = await generateCourse(region, moodLabels);

  return (
    <CourseResult course={course} region={region} moodLabels={moodLabels} />
  );
}
