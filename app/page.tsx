import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { CoursePreview } from "./_components/course-preview";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-5 pb-7">
      <Header />

      <section className="flex flex-1 flex-col justify-center py-7">
        <p className="text-xs font-medium tracking-wide text-brand-text">
          데이트 코스, 1분이면 충분해요
        </p>
        <h1 className="mt-3 text-[28px] leading-[1.25] font-bold tracking-[-0.02em] text-foreground">
          오늘,
          <br />
          어디서
          <br />
          만날까요?
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          지역과 분위기만 고르면,
          <br />
          식사부터 산책까지 동선을 한 번에.
        </p>

        <div className="mt-8">
          <CoursePreview />
        </div>
      </section>

      <div>
        <Link
          href="/create"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-semibold text-brand-fg transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.99] active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          코스 만들기
          <ArrowRight className="size-[18px]" />
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          로그인 없이 바로 시작
        </p>
      </div>
    </main>
  );
}
