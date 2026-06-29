import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRegionById } from "@/lib/regions";
import { getMoodById } from "@/lib/moods";

interface ResultPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 중복 쿼리 키는 배열로 들어올 수 있어 첫 값으로 정규화한다.
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// 코스 생성·지도 렌더는 다음 슬라이스. 지금은 전달된 입력값만 확인한다.
export default async function ResultPage({ searchParams }: ResultPageProps) {
  const sp = await searchParams;
  const regionId = first(sp.region);
  const moodsParam = first(sp.moods);
  const region = regionId ? getRegionById(regionId) : undefined;
  const moodLabels = (moodsParam ? moodsParam.split(",") : [])
    .map((id) => getMoodById(id)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        결과 화면은 다음 슬라이스에서 만들어요.
      </p>
      <div className="rounded-xl border border-border px-4 py-3 text-sm">
        <span className="font-semibold text-foreground">
          {region?.name ?? regionId ?? "-"}
        </span>
        <span className="text-muted-foreground"> · {moodLabels || "-"}</span>
      </div>
      <Link
        href="/create"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:underline"
      >
        <ArrowLeft className="size-4" />
        조건 다시 고르기
      </Link>
    </main>
  );
}
