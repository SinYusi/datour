import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <ThemeToggle />
    </header>
  );
}
