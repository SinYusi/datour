"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/c/${shareId}`;

    // 모바일: 네이티브 공유 시트. 미지원/취소 시 클립보드 복사로 폴백.
    if (navigator.share) {
      try {
        await navigator.share({ title: "Datour 데이트 코스", url });
      } catch {
        // 사용자가 공유를 취소한 경우 등 — 조용히 종료
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-fg transition-colors hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {copied ? (
        <>
          <Check className="size-4" />
          링크 복사됨
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          공유하기
        </>
      )}
    </button>
  );
}
