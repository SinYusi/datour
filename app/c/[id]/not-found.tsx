import Link from "next/link";

export default function ShareNotFound() {
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
