"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ResultError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-sm leading-relaxed text-muted-foreground">
        코스를 만들지 못했어요.
        <br />
        잠시 후 다시 시도해주세요.
      </p>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg transition-colors hover:bg-brand-hover active:bg-brand-active"
        >
          <RefreshCw className="size-4" />
          다시 시도
        </button>
        <Link
          href="/create"
          className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          조건 다시 고르기
        </Link>
      </div>
    </main>
  );
}
