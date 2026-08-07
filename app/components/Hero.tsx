export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 pt-32 pb-20 text-slate-950 dark:text-slate-100 sm:px-8"
    >
      <div className="hero-glow" aria-hidden="true" />
      <div className="mx-auto flex min-h-[75vh] max-w-6xl flex-col gap-10 rounded-[36px] border border-slate-200/80 bg-white/85 p-8 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.3)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/85 sm:p-12 md:flex-row md:items-center">
        <div className="relative flex-shrink-0">
          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-500/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-2xl shadow-slate-900/10 dark:border-slate-700/80 dark:bg-slate-900">
            <img
              src="/profile.jpg"
              alt="Profile Photo"
              className="h-64 w-64 object-cover md:h-72 md:w-72"
            />
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/90 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700/90 dark:bg-slate-900/90 dark:text-slate-200">
            <span className="font-semibold">Math + Tech + Finance</span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-lg shadow-sky-500/20" />
            Quantitative Analysis, Financial Modeling, Algorithmic Trading
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Building elegant systems where math, algorithms, and product drive impact.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Fourth-year Georgia Tech CS student with experience in software engineering, machine learning, quant-style problem solving, and technical mentorship.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#experience"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-400"
            >
              Explore Experience
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500"
            >
              View Projects
            </a>
            <a
              href="#interview"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500"
            >
              Watch Interviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
