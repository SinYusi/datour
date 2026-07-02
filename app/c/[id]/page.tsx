import type { Metadata } from "next";
import Link from "next/link";
import { getCourseById } from "@/lib/courses";
import { getRegionById } from "@/lib/regions";
import { getMoodById } from "@/lib/moods";
import { CourseResult } from "@/components/course/course-result";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return {};
  const saved = await getCourseById(id);
  if (!saved) return {};
  return {
    title: `${saved.course.course_title} · Datour`,
    description: saved.course.summary,
  };
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        코스를 찾을 수 없어요. 링크가 만료되었거나 잘못됐을 수 있어요.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-brand-text hover:underline"
      >
        코스 만들러 가기
      </Link>
    </main>
  );
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return <NotFound />;

  const saved = await getCourseById(id);
  const region = saved ? getRegionById(saved.regionId) : undefined;
  if (!saved || !region) return <NotFound />;

  const moodLabels = saved.moodIds
    .map((mid) => getMoodById(mid)?.label)
    .filter((label): label is string => Boolean(label));

  return (
    <CourseResult
      course={saved.course}
      region={region}
      moodLabels={moodLabels}
      shareId={id}
      shared
    />
  );
}
