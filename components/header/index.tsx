import { Logo } from "./logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <ThemeToggle />
    </header>
  );
}
