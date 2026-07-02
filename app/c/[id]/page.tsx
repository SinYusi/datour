import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const saved = await getCourseById(id);
  const region = saved ? getRegionById(saved.regionId) : undefined;
  if (!saved || !region) notFound();

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
