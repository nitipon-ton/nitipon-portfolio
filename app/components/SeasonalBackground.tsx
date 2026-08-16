"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { useTheme } from "next-themes";
import { FUN_FACTS } from "../data/funFacts";

/**
 * Decorative background field. Particle sets are built once at module load
 * with a seeded PRNG (never Math.random) so positions are stable, and every
 * animation runs purely on transform/opacity to stay off the main thread.
 *
 * Easter is the one interactive mode: each egg maps to a fun fact and the
 * layer is raised above the content so the eggs can actually be clicked.
 */

type Particle = {
  char: string;
  className: string;
  style: CSSProperties;
};

// Deterministic LCG — same field on every load, no hydration surprises.
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Jittered grid so particles spread out instead of clumping.
function positions(count: number, cols: number, rnd: () => number) {
  const rows = Math.ceil(count / cols);
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: ((col + 0.1 + rnd() * 0.8) / cols) * 100,
      y: ((row + 0.1 + rnd() * 0.8) / rows) * 100,
    };
  });
}

const round = (n: number) => Math.round(n * 100) / 100;

const FORMULAS = [
  "e^{iπ} + 1 = 0",
  "∫₀^∞ e^{−x²} dx = √π/2",
  "∑ 1/n² = π²/6",
  "∇ × E = −∂B/∂t",
  "a² + b² = c²",
  "φ = (1 + √5)/2",
  "lim(x→0) sin x / x = 1",
  "P(A|B) = P(B|A)P(A)/P(B)",
  "∂²u/∂t² = c²∇²u",
  "x = (−b ± √(b²−4ac))/2a",
  "∮ E·dA = Q/ε₀",
  "det(A − λI) = 0",
  "d/dx eˣ = eˣ",
  "cos²θ + sin²θ = 1",
  "∫ u dv = uv − ∫ v du",
  "ζ(s) = ∑ n^{−s}",
  "n! = n·(n−1)!",
  "σ = √(∑(xᵢ−μ)²/N)",
  "∀ε>0 ∃δ>0",
  "E = mc²",
];

const GLYPHS = ["∑", "∫", "π", "∞", "√", "∂", "∇", "θ", "λ", "Ω"];

function buildMath(): Particle[] {
  const rnd = prng(20260816);
  const items = [...FORMULAS, ...GLYPHS];
  const pos = positions(items.length, 5, rnd);

  return items.map((char, i) => {
    const isGlyph = i >= FORMULAS.length;
    return {
      char,
      className: "season-particle season-math",
      style: {
        "--x": `${round(pos[i].x)}%`,
        "--y": `${round(pos[i].y)}%`,
        "--s": isGlyph ? `${round(2 + rnd() * 1.6)}rem` : `${round(0.8 + rnd() * 0.5)}rem`,
        "--o": round((isGlyph ? 0.7 : 1) * (0.55 + rnd() * 0.6)),
        "--dx": `${round(-26 + rnd() * 52)}px`,
        "--dy": `${round(-46 - rnd() * 34)}px`,
        "--r0": `${round(-6 + rnd() * 12)}deg`,
        "--r1": `${round(-8 + rnd() * 16)}deg`,
        "--dur": `${round(18 + rnd() * 20)}s`,
        "--delay": `${round(rnd() * -24)}s`,
      } as CSSProperties,
    };
  });
}

const SNOWFLAKES = ["❄", "❅", "❆", "•"];
const ORNAMENTS = ["🎄", "🎁", "⭐", "🔔", "🎅", "🦌", "🕯️", "🍬", "☃️", "🧦"];

function buildChristmas(): Particle[] {
  const rnd = prng(1225);

  const snow: Particle[] = Array.from({ length: 26 }, (_, i) => ({
    char: SNOWFLAKES[i % SNOWFLAKES.length],
    className: "season-particle season-snow",
    style: {
      "--x": `${round(rnd() * 98)}%`,
      "--y": `${round(rnd() * 96)}%`,
      "--s": `${round(0.6 + rnd() * 0.9)}rem`,
      "--o": round(0.45 + rnd() * 0.5),
      "--dx": `${round(-70 + rnd() * 140)}px`,
      "--r1": `${round(180 + rnd() * 540)}deg`,
      "--dur": `${round(14 + rnd() * 16)}s`,
      "--delay": `${round(rnd() * -30)}s`,
    } as CSSProperties,
  }));

  const pos = positions(ORNAMENTS.length, 5, rnd);
  const decor: Particle[] = ORNAMENTS.map((char, i) => ({
    char,
    className: "season-particle season-emoji",
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(1.6 + rnd() * 1.3)}rem`,
      "--o": round(0.5 + rnd() * 0.35),
      "--dx": `${round(-18 + rnd() * 36)}px`,
      "--dy": `${round(-30 - rnd() * 26)}px`,
      "--r0": `${round(-10 + rnd() * 20)}deg`,
      "--r1": `${round(-12 + rnd() * 24)}deg`,
      "--dur": `${round(16 + rnd() * 14)}s`,
      "--delay": `${round(rnd() * -20)}s`,
    } as CSSProperties,
  }));

  // Interleave so the mobile `nth-child(2n)` cull thins both sets evenly.
  return snow.flatMap((flake, i) => (decor[i] ? [flake, decor[i]] : [flake]));
}

const SPOOKS = ["🎃", "👻", "🦇", "🕷️", "🕸️", "💀", "🌙", "🧙", "🍬", "⚰️"];

function buildHalloween(): Particle[] {
  const rnd = prng(1031);
  const items = [...SPOOKS, ...SPOOKS.slice(0, 8)];
  const pos = positions(items.length, 5, rnd);

  return items.map((char, i) => ({
    char,
    className: `season-particle season-emoji${rnd() > 0.45 ? " season-haunt" : ""}`,
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(1.5 + rnd() * 1.5)}rem`,
      "--o": round(0.45 + rnd() * 0.4),
      "--dx": `${round(-40 + rnd() * 80)}px`,
      "--dy": `${round(-34 - rnd() * 30)}px`,
      "--r0": `${round(-12 + rnd() * 24)}deg`,
      "--r1": `${round(-14 + rnd() * 28)}deg`,
      "--dur": `${round(12 + rnd() * 16)}s`,
      "--delay": `${round(rnd() * -18)}s`,
    } as CSSProperties,
  }));
}

const HEARTS = ["💖", "💕", "❤️", "💗", "💘", "🌹", "💝", "💞"];
const KEEPSAKES = ["💌", "🌷", "🧁", "🍫", "🎀", "💐", "🕯️", "🥂"];

function buildValentine(): Particle[] {
  const rnd = prng(214);

  const rising: Particle[] = Array.from({ length: 22 }, (_, i) => ({
    char: HEARTS[i % HEARTS.length],
    className: "season-particle season-heart",
    style: {
      "--x": `${round(rnd() * 96)}%`,
      "--y": `${round(rnd() * 96)}%`,
      "--s": `${round(0.9 + rnd() * 1.1)}rem`,
      "--o": round(0.45 + rnd() * 0.45),
      "--dx": `${round(-60 + rnd() * 120)}px`,
      "--r1": `${round(-40 + rnd() * 80)}deg`,
      "--dur": `${round(15 + rnd() * 15)}s`,
      "--delay": `${round(rnd() * -30)}s`,
    } as CSSProperties,
  }));

  const pos = positions(KEEPSAKES.length, 4, rnd);
  const decor: Particle[] = KEEPSAKES.map((char, i) => ({
    char,
    className: "season-particle season-emoji",
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(1.5 + rnd() * 1.2)}rem`,
      "--o": round(0.45 + rnd() * 0.3),
      "--dx": `${round(-18 + rnd() * 36)}px`,
      "--dy": `${round(-28 - rnd() * 24)}px`,
      "--r0": `${round(-10 + rnd() * 20)}deg`,
      "--r1": `${round(-12 + rnd() * 24)}deg`,
      "--dur": `${round(16 + rnd() * 14)}s`,
      "--delay": `${round(rnd() * -20)}s`,
    } as CSSProperties,
  }));

  // Interleave so the mobile `nth-child(2n)` cull thins both sets evenly.
  return rising.flatMap((heart, i) => (decor[i] ? [heart, decor[i]] : [heart]));
}

const EGG_FACES = ["🥚", "🐣", "🐰", "🌷", "🐤", "🧺", "🐇", "🌸", "🍬", "🦋"];

/** One egg per fun fact — adding a fact to funFacts.ts adds an egg here. */
function buildEaster(): Particle[] {
  const rnd = prng(407);
  const cols = FUN_FACTS.length > 12 ? 4 : 3;
  const pos = positions(FUN_FACTS.length, cols, rnd);

  return FUN_FACTS.map((fact, i) => ({
    char: fact.emoji ?? EGG_FACES[i % EGG_FACES.length],
    className: "season-particle season-egg",
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(1.5 + rnd() * 0.9)}rem`,
      "--o": round(0.62 + rnd() * 0.25),
      "--dx": `${round(-22 + rnd() * 44)}px`,
      "--dy": `${round(-28 - rnd() * 24)}px`,
      "--r0": `${round(-10 + rnd() * 20)}deg`,
      "--r1": `${round(-12 + rnd() * 24)}deg`,
      "--dur": `${round(15 + rnd() * 15)}s`,
      "--delay": `${round(rnd() * -20)}s`,
    } as CSSProperties,
  }));
}

const MATH_FIELD = buildMath();

const FIELDS: Record<string, Particle[]> = {
  light: MATH_FIELD,
  dark: MATH_FIELD,
  valentine: buildValentine(),
  easter: buildEaster(),
  halloween: buildHalloween(),
  christmas: buildChristmas(),
};

/** false while server-rendering, true once hydrated — no setState in an effect. */
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

export default function SeasonalBackground() {
  const { theme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const [openEgg, setOpenEgg] = useState<number | null>(null);
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeEgg = useCallback(() => setOpenEgg(null), []);

  useEffect(() => {
    if (openEgg === null) return;

    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEgg();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openEgg, closeEgg]);

  // Rendering only after mount keeps the server HTML theme-agnostic.
  if (!mounted) return null;

  const mode = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const particles = FIELDS[mode] ?? FIELDS.light;
  const isEaster = mode === "easter";
  const fact = openEgg === null ? null : FUN_FACTS[openEgg];

  return (
    <>
      <div
        className={`season-bg${isEaster ? " season-bg--easter" : ""}`}
        // Decorative modes are hidden from AT; Easter holds real buttons.
        aria-hidden={isEaster ? undefined : true}
        role={isEaster ? "group" : undefined}
        aria-label={isEaster ? "Easter egg hunt — hidden facts about Nitipon" : undefined}
      >
        {particles.map((p, i) =>
          isEaster ? (
            <button
              key={`easter-${i}`}
              type="button"
              className={`${p.className}${found.has(i) ? " season-egg--found" : ""}`}
              style={p.style}
              onClick={() => {
                setOpenEgg(i);
                setFound((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
              }}
              aria-label={`Hidden egg ${i + 1} of ${FUN_FACTS.length}${
                found.has(i) ? " (already found)" : ""
              }`}
            >
              <span aria-hidden="true">{p.char}</span>
            </button>
          ) : (
            <span key={`${mode}-${i}`} className={p.className} style={p.style}>
              {p.char}
            </span>
          )
        )}
      </div>

      {fact && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-6 backdrop-blur-sm"
          onClick={closeEgg}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="egg-fact-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/95 p-7 shadow-[0_40px_100px_-30px_rgba(15,23,42,0.5)] dark:border-slate-700/80 dark:bg-slate-900/95"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeEgg}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              ×
            </button>

            <div className="mb-4 text-4xl" aria-hidden="true">
              {fact.emoji ?? EGG_FACES[openEgg! % EGG_FACES.length]}
            </div>

            <h3
              id="egg-fact-title"
              className="mb-3 pr-8 text-2xl font-semibold text-slate-950 dark:text-white"
            >
              {fact.title}
            </h3>
            <p className="text-base leading-7 text-slate-700 dark:text-slate-300">{fact.fact}</p>

            {fact.link && (
              <a
                href={fact.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                {fact.link.label} →
              </a>
            )}

            <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
              🥚 {found.size} of {FUN_FACTS.length} eggs found
            </p>
          </div>
        </div>
      )}
    </>
  );
}
