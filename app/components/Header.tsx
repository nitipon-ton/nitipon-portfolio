import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-700/75 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Math · Tech · Finance
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            Nitipon (Tony) Trimaitreepituk
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#about" className="hover:text-slate-950 dark:hover:text-white">About</a>
            <a href="#experience" className="hover:text-slate-950 dark:hover:text-white">Experience</a>
            <a href="#projects" className="hover:text-slate-950 dark:hover:text-white">Projects</a>
            <a href="#achievements" className="hover:text-slate-950 dark:hover:text-white">Achievements</a>
            <a href="#contact" className="hover:text-slate-950 dark:hover:text-white">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}