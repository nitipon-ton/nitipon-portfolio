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

/**
 * Placement for Easter's eggs: down the ENTIRE page rather than the viewport,
 * so the hunt is something you scroll through instead of 26 emoji crammed into
 * one screen. `y` is an even spread with jitter over the document's height —
 * the layer they live on is document-tall (see `.season-scatter`), so a `%`
 * here means a percentage of the whole page.
 *
 * `x` stays in the left and right gutters, alternating, to keep them off the
 * centred text column.
 */
function scatterPositions(count: number, rnd: () => number) {
  const band = 100 / count;
  return Array.from({ length: count }, (_, i) => ({
    // Tight to the very edges: the content reaches further out than you'd
    // guess. This is only the fallback — `findHidingSpots` replaces it once
    // the real layout has been measured.
    x: i % 2 === 0 ? 0.4 + rnd() * 6.6 : 92.5 + rnd() * 6.5,
    y: i * band + rnd() * band,
  }));
}

/**
 * Where to hide Easter's eggs, measured from the page as it actually rendered.
 *
 * Static gutters don't work here: this layout's text runs from 73px to 1367px
 * of a 1440px viewport, so the "margins" are ~70px wide on desktop and simply
 * don't exist on a phone. Anything wide enough to hold an egg is also on top
 * of a paragraph.
 *
 * So instead of hiding them beside the content, hide them BETWEEN it — in the
 * vertical seams between sections and cards, which exist at every viewport and
 * are exactly the sort of place a hidden egg belongs. Gaps are found by
 * merging every text/media box in the document and taking the complement.
 *
 * Returns null when the page is too dense to find seams, in which case the
 * caller keeps the built-in gutter positions.
 */
function findHidingSpots(count: number, layerTop: number, minGap = 56) {
  const rnd = prng(40721);

  const boxes = [...document.querySelectorAll("h1,h2,h3,h4,p,li,a,button,img")]
    // Skip our own layers, or the eggs would count as things to avoid.
    .filter((n) => !n.closest(".season-scatter, .season-bg"))
    .map((n) => n.getBoundingClientRect())
    .filter((r) => r.height > 0 && r.width > 0)
    .map((r) => ({ top: r.top + window.scrollY, bottom: r.bottom + window.scrollY }))
    .sort((a, b) => a.top - b.top);

  const merged: { top: number; bottom: number }[] = [];
  for (const box of boxes) {
    const last = merged[merged.length - 1];
    if (last && box.top <= last.bottom + 4) last.bottom = Math.max(last.bottom, box.bottom);
    else merged.push({ ...box });
  }

  const docHeight = document.documentElement.scrollHeight;
  const gaps: { top: number; bottom: number }[] = [];
  let cursor = layerTop;
  for (const block of merged) {
    if (block.top - cursor >= minGap) gaps.push({ top: cursor, bottom: block.top });
    cursor = Math.max(cursor, block.bottom);
  }
  if (docHeight - cursor >= minGap) gaps.push({ top: cursor, bottom: docHeight });

  if (gaps.length === 0) return null;

  // Even stride through the gap list, so eggs spread over the whole page
  // instead of filling every seam at the top and running out.
  const gapOf = Array.from({ length: count }, (_, i) =>
    Math.floor((i * gaps.length) / count)
  );

  return gapOf.map((gapIndex, i) => {
    const gap = gaps[gapIndex];
    const room = Math.max(1, gap.bottom - gap.top - 28);

    // Several eggs can land in one seam. Give each its own horizontal slot,
    // or they stack on top of each other and read as a single egg.
    const sharing = gapOf.filter((g) => g === gapIndex).length;
    const slot = gapOf.slice(0, i).filter((g) => g === gapIndex).length;
    const width = 92 / sharing;

    return {
      x: 4 + slot * width + rnd() * width * 0.7,
      y: gap.top + 14 + rnd() * room - layerTop,
    };
  });
}


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

/**
 * Catchable items that fall — Christmas's snowflakes, Valentine's hearts and
 * love letters. The same idea as Space's comets: a few of them crossing above
 * the content, each opening a fun fact.
 *
 * Unlike the comets these never fade, so there's no window where an invisible
 * one could swallow a click: the fall carries them from above the viewport to
 * below it, and off-screen is the only time they aren't clickable. That also
 * means they simply freeze in place under reduced motion, still catchable,
 * which is why `--y` is a real spread rather than 0.
 */
function buildFalling(chars: string[], className: string, seed: number, count = 6): Particle[] {
  const rnd = prng(seed);

  return Array.from({ length: count }, (_, i) => ({
    char: chars[i % chars.length],
    className: `season-particle season-catch ${className}`,
    style: {
      "--x": `${round(5 + rnd() * 86)}%`,
      "--y": `${round(8 + rnd() * 74)}%`,
      "--s": `${round(1.4 + rnd() * 0.8)}rem`,
      "--o": round(0.82 + rnd() * 0.18),
      "--dx": `${round(-60 + rnd() * 120)}px`,
      "--r1": `${round(180 + rnd() * 540)}deg`,
      "--dur": `${round(17 + rnd() * 13)}s`,
      "--delay": `${round(i * -4 - rnd() * 14)}s`,
    } as CSSProperties,
  }));
}

/** Summer's catchable bubbles, rising the way its decorative ones do. */
function buildRising(chars: string[], className: string, seed: number, count = 6): Particle[] {
  const rnd = prng(seed);

  return Array.from({ length: count }, (_, i) => ({
    char: chars[i % chars.length],
    className: `season-particle season-catch ${className}`,
    style: {
      "--x": `${round(5 + rnd() * 86)}%`,
      "--y": `${round(10 + rnd() * 70)}%`,
      "--s": `${round(1.3 + rnd() * 1)}rem`,
      "--o": round(0.8 + rnd() * 0.2),
      "--dx": `${round(-70 + rnd() * 140)}px`,
      "--r1": `${round(-40 + rnd() * 80)}deg`,
      "--dur": `${round(18 + rnd() * 12)}s`,
      "--delay": `${round(i * -4 - rnd() * 16)}s`,
    } as CSSProperties,
  }));
}

/**
 * Halloween's flyers cross like the comets do, but on a lurching path — see
 * `season-swoop`. `--dy` is how far they veer off course and `--r0`/`--r1` how
 * hard they tumble; both are wide here on purpose, so no two crossings look
 * alike and the whole thing reads as haunted rather than orderly.
 */
function buildSwooping(chars: string[], seed: number, count = 7): Particle[] {
  const rnd = prng(seed);

  return Array.from({ length: count }, (_, i) => ({
    char: chars[i % chars.length],
    className: "season-particle season-catch season-swoop",
    style: {
      "--x": "0%",
      "--y": `${round(10 + rnd() * 62)}%`,
      "--s": `${round(1.5 + rnd() * 1)}rem`,
      "--o": round(0.8 + rnd() * 0.2),
      "--dy": `${round(12 + rnd() * 22)}vh`,
      "--r0": `${round(-26 + rnd() * 52)}deg`,
      "--r1": `${round(-34 + rnd() * 68)}deg`,
      "--rmx": `${round(8 + i * 12 + rnd() * 6)}%`,
      "--rmy": `${round(12 + (i % 4) * 20 + rnd() * 9)}%`,
      "--dur": `${round(11 + rnd() * 14)}s`,
      "--delay": `${round(i * -5 - rnd() * 16)}s`,
    } as CSSProperties,
  }));
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

const STARS = ["✦", "✧", "⋆", "·", "•"];
const SIGNALS = ["◇", "◈", "⬡", "⬢", "⟡", "△", "▽", "⊹", "⌖", "◎"];
// Instrument readouts, not jokes — real units, plausible magnitudes.
const TELEMETRY = [
  "Δv 11.2 km/s",
  "orbit 402 km",
  "λ 656.3 nm",
  "az 137.4°",
  "T−00:09:41",
  "z = 1.42",
  "4.2465 ly",
  "sig ▮▮▮▯",
  "1.989e30 kg",
  "3.26 parsec",
  "vac 299 792 458",
  "sol iii",
];

function buildSpace(): Particle[] {
  const rnd = prng(1969);

  // A proper starfield: fixed points that only brighten and dim. Nothing here
  // drifts or drags — the movement in this theme is the comets and the nebula.
  const stars: Particle[] = Array.from({ length: 68 }, (_, i) => ({
    char: STARS[i % STARS.length],
    className: "season-particle season-star",
    style: {
      "--x": `${round(rnd() * 98)}%`,
      "--y": `${round(rnd() * 97)}%`,
      "--s": `${round(0.3 + rnd() * 0.8)}rem`,
      "--o": round(0.45 + rnd() * 0.55),
      "--dur": `${round(3 + rnd() * 7)}s`,
      "--delay": `${round(rnd() * -10)}s`,
    } as CSSProperties,
  }));

  const hudPos = positions(TELEMETRY.length, 3, rnd);
  const hud: Particle[] = TELEMETRY.map((char, i) => ({
    char,
    className: "season-particle season-hud",
    style: {
      // Readouts are long, left-anchored strings, so their column stops well
      // short of the right edge — at 90% they'd hang off the viewport.
      "--x": `${round(2 + hudPos[i].x * 0.76)}%`,
      "--y": `${round(hudPos[i].y)}%`,
      "--s": `${round(0.6 + rnd() * 0.3)}rem`,
      "--o": round(0.5 + rnd() * 0.4),
      "--dx": `${round(-20 + rnd() * 40)}px`,
      "--dy": `${round(-30 - rnd() * 26)}px`,
      "--r0": "0deg",
      "--r1": "0deg",
      "--dur": `${round(20 + rnd() * 18)}s`,
      "--delay": `${round(rnd() * -26)}s`,
    } as CSSProperties,
  }));

  const sigPos = positions(SIGNALS.length, 4, rnd);
  const signals: Particle[] = SIGNALS.map((char, i) => ({
    char,
    className: "season-particle season-signal",
    style: {
      "--x": `${round(sigPos[i].x)}%`,
      "--y": `${round(sigPos[i].y)}%`,
      "--s": `${round(1.6 + rnd() * 1.8)}rem`,
      "--o": round(0.55 + rnd() * 0.35),
      "--dx": `${round(-30 + rnd() * 60)}px`,
      "--dy": `${round(-36 - rnd() * 30)}px`,
      "--dur": `${round(26 + rnd() * 22)}s`,
      "--delay": `${round(rnd() * -40)}s`,
    } as CSSProperties,
  }));

  // Round-robin the three sets so the mobile `nth-child(2n)` cull thins each
  // of them proportionally instead of wiping one out entirely.
  const sets = [stars, hud, signals];
  const longest = Math.max(...sets.map((s) => s.length));
  const merged: Particle[] = [];
  for (let i = 0; i < longest; i++) {
    for (const set of sets) if (set[i]) merged.push(set[i]);
  }
  return merged;
}

/**
 * Comets ride the shared moving-finds layer ABOVE the content (.season-bg--sky).
 * Behind it they'd spend the whole crossing hidden under the cards, which
 * is most of the viewport — the streak has to pass over the page to read
 * as one. The layer is click-through and sits below the fixed header; the
 * comets themselves opt back into pointer events, because catching one opens
 * a random fun fact. They fade in and out entirely off-screen, so a comet is
 * clickable exactly when it is visible — see the keyframes.
 */
function buildSpaceComets(): Particle[] {
  const rnd = prng(1977);

  // No character: the streak is drawn in CSS, so `--s` is its length and
  // `--r0` tilts it to line up with the diagonal it travels.
  return Array.from({ length: 4 }, (_, i) => ({
    char: "",
    className: "season-particle season-comet",
    style: {
      "--x": "0%",
      "--y": `${round(4 + rnd() * 42)}%`,
      "--s": `${round(110 + rnd() * 90)}px`,
      "--o": round(0.6 + rnd() * 0.25),
      "--dy": `${round(26 + rnd() * 26)}vh`,
      "--r0": `${round(9 + rnd() * 7)}deg`,
      // Where each one parks when the visitor has asked for reduced motion.
      // They stay on screen rather than being hidden, because they carry the
      // facts — removing them would put those out of reach entirely.
      "--rmx": `${round(9 + i * 22 + rnd() * 7)}%`,
      "--rmy": `${round(16 + i * 19 + rnd() * 8)}%`,
      // Long cycles, staggered hard, so a comet is an event you happen to
      // catch — never a loop repeating in the corner of your eye.
      "--dur": `${round(15 + rnd() * 11)}s`,
      "--delay": `${round(i * -11 - rnd() * 14)}s`,
    } as CSSProperties,
  }));
}

const SPACE_COMETS = buildSpaceComets();

const BUBBLES = ["○", "◦", "•", "◌"];
const SEASIDE = ["🌞", "🌴", "🍉", "🏖️", "🌊", "🐚", "🍦", "😎", "⛱️", "🦀", "🩴", "🥥"];

function buildSummer(): Particle[] {
  const rnd = prng(621);

  const rising: Particle[] = Array.from({ length: 24 }, (_, i) => ({
    char: BUBBLES[i % BUBBLES.length],
    className: "season-particle season-bubble",
    style: {
      "--x": `${round(rnd() * 96)}%`,
      "--y": `${round(rnd() * 96)}%`,
      "--s": `${round(0.5 + rnd() * 0.9)}rem`,
      "--o": round(0.4 + rnd() * 0.45),
      "--dx": `${round(-50 + rnd() * 100)}px`,
      "--r1": `${round(-30 + rnd() * 60)}deg`,
      "--dur": `${round(16 + rnd() * 16)}s`,
      "--delay": `${round(rnd() * -32)}s`,
    } as CSSProperties,
  }));

  const pos = positions(SEASIDE.length, 4, rnd);
  const decor: Particle[] = SEASIDE.map((char, i) => ({
    char,
    className: "season-particle season-emoji",
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(1.6 + rnd() * 1.3)}rem`,
      "--o": round(0.45 + rnd() * 0.35),
      "--dx": `${round(-24 + rnd() * 48)}px`,
      "--dy": `${round(-26 - rnd() * 24)}px`,
      "--r0": `${round(-8 + rnd() * 16)}deg`,
      "--r1": `${round(-10 + rnd() * 20)}deg`,
      "--dur": `${round(18 + rnd() * 14)}s`,
      "--delay": `${round(rnd() * -22)}s`,
    } as CSSProperties,
  }));

  // Interleave so the mobile `nth-child(2n)` cull thins both sets evenly.
  return rising.flatMap((bubble, i) => (decor[i] ? [bubble, decor[i]] : [bubble]));
}

/**
 * Easter's screen is eggs and nothing else — no stray flowers, bunnies or
 * chicks. That means there is no decorative field at all here: the only things
 * on the page are the eggs you can actually open. The fact's own emoji is kept
 * for the card that opens, not sprayed across the background.
 */
function buildEaster(): Particle[] {
  return [];
}

/** Shells for the painted eggs, cycled so no two neighbours match. */
const EGG_COLORS = [
  { shell: "#f9a8d4", band: "#be185d" },
  { shell: "#a5b4fc", band: "#4338ca" },
  { shell: "#86efac", band: "#15803d" },
  { shell: "#fde68a", band: "#b45309" },
  { shell: "#7dd3fc", band: "#0369a1" },
  { shell: "#d8b4fe", band: "#7e22ce" },
  { shell: "#fca5a5", band: "#b91c1c" },
  { shell: "#5eead4", band: "#0f766e" },
];

/**
 * A painted egg. Drawn rather than an emoji because there is no such thing as
 * a coloured-egg emoji — 🥚 is one pale shell and nothing else, so a page full
 * of them would be a page full of identical white blobs.
 */
export function EggMark({ index, className }: { index: number; className?: string }) {
  const { shell, band } = EGG_COLORS[index % EGG_COLORS.length];
  const pattern = index % 3;
  const clip = `egg-clip-${index}${className ? "-inline" : ""}`;

  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path d="M20 2 C30 2 38 18 38 32 C38 44 30 50 20 50 C10 50 2 44 2 32 C2 18 10 2 20 2 Z" />
        </clipPath>
      </defs>
      <path
        d="M20 2 C30 2 38 18 38 32 C38 44 30 50 20 50 C10 50 2 44 2 32 C2 18 10 2 20 2 Z"
        fill={shell}
      />
      <g clipPath={`url(#${clip})`} fill={band}>
        {pattern === 0 && (
          <>
            <rect x="0" y="17" width="40" height="4.5" />
            <rect x="0" y="31" width="40" height="4.5" />
          </>
        )}
        {pattern === 1 && (
          <>
            <circle cx="12" cy="18" r="3" />
            <circle cx="27" cy="24" r="3" />
            <circle cx="14" cy="33" r="3" />
            <circle cx="28" cy="41" r="3" />
          </>
        )}
        {pattern === 2 && (
          <path d="M0 24 L8 18 L16 24 L24 18 L32 24 L40 18 L40 23 L32 29 L24 23 L16 29 L8 23 L0 29 Z" />
        )}
      </g>
      {/* shine */}
      <ellipse cx="14" cy="14" rx="4.5" ry="6.5" fill="#ffffff" opacity="0.45" />
    </svg>
  );
}

/**
 * One egg per fun fact — adding a fact to funFacts.ts adds an egg here.
 * These ride the document-tall scatter layer, so they're spread down the whole
 * page and you scroll to find them, rather than 26 of them crowding a single
 * screen. Down the gutters, so they stay off the text either way.
 */
function buildEasterEggs(): Particle[] {
  const rnd = prng(4071);
  const pos = scatterPositions(FUN_FACTS.length, rnd);

  return FUN_FACTS.map((_, i) => ({
    // No character: the egg is drawn (see EggMark). The fact's own emoji is
    // saved for the card that opens.
    char: "",
    className: "season-particle season-collect season-collect--egg",
    style: {
      "--x": `${round(pos[i].x)}%`,
      "--y": `${round(pos[i].y)}%`,
      "--s": `${round(26 + rnd() * 12)}px`,
      "--o": round(0.75 + rnd() * 0.25),
      "--dx": `${round(-16 + rnd() * 32)}px`,
      "--dy": `${round(-22 - rnd() * 20)}px`,
      "--r0": `${round(-10 + rnd() * 20)}deg`,
      "--r1": `${round(-12 + rnd() * 24)}deg`,
      "--dur": `${round(15 + rnd() * 15)}s`,
      "--delay": `${round(rnd() * -20)}s`,
    } as CSSProperties,
  }));
}

const MATH_FIELD = buildMath();

/**
 * Clickable finds per theme — each opens a fun fact. Light and Dark are
 * deliberately absent: they're the everyday themes and stay uncluttered.
 *
 * Space and Christmas are absent because their finds fly instead: comets and
 * rockets for one, falling snowflakes for the other. See SKY below.
 */
const COLLECTIBLES: Record<string, Particle[]> = {
  easter: buildEasterEggs(),
};

/** Easter's eggs hide down the whole page rather than ringing the viewport. */
const SCATTERED = new Set(["easter"]);

/**
 * Finds that move across the content on the raised layer. Each theme's items
 * travel the way that theme's decoration does — snow and love letters fall,
 * bubbles rise, comets streak, and Halloween's lot lurch about.
 */
const SKY: Record<string, { items: Particle[]; noun: string }[]> = {
  valentine: [
    { items: buildFalling(["💌", "❤️", "💗", "💝", "💕", "✉️"], "season-loveletter", 2141), noun: "heart" },
  ],
  summer: [
    { items: buildRising(["○", "◦", "◌", "•"], "season-bubblecatch", 6211), noun: "bubble" },
  ],
  halloween: [
    { items: buildSwooping(["👻", "💀", "🦇", "🎃", "🕷️", "🧙", "⚰️"], 10311), noun: "spook" },
  ],
  christmas: [
    { items: buildFalling(["❄", "❅", "❆"], "season-snowfall", 12252), noun: "snowflake" },
  ],
  space: [{ items: SPACE_COMETS, noun: "comet" }],
};

const FIELDS: Record<string, Particle[]> = {
  light: MATH_FIELD,
  dark: MATH_FIELD,
  valentine: buildValentine(),
  easter: buildEaster(),
  summer: buildSummer(),
  space: buildSpace(),
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
  // `source` decides the modal's footer: Easter counts eggs found against the
  // full set, everything else just counts finds. Null means nothing is open.
  const [open, setOpen] = useState<{ index: number; source: "egg" | "sky" } | null>(null);
  /** Fact indices discovered this session, by any theme's mechanic. */
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeEgg = useCallback(() => setOpen(null), []);

  /**
   * Only Easter's eggs map to a specific fact — there's one egg per fact, so
   * the hunt can be completed. Everything else is a handful of finds against
   * a much longer fact list, so they pull a fact at random.
   *
   * The draw is from the facts NOT yet found, falling back to the whole list
   * once they've all been seen. Drawing from everything would repeat facts
   * long before the set was exhausted, which makes the progress count both
   * stall and lie. Math.random is safe here: it runs on click, never during
   * render, so hydration is unaffected.
   */
  const revealRandom = useCallback(
    (source: "sky") => {
      const unseen = FUN_FACTS.map((_, i) => i).filter((i) => !found.has(i));
      const pool = unseen.length > 0 ? unseen : FUN_FACTS.map((_, i) => i);
      const index = pool[Math.floor(Math.random() * pool.length)];

      setOpen({ index, source });
      setFound((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
    },
    [found]
  );

  useEffect(() => {
    if (open === null) return;

    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEgg();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeEgg]);

  const mode = mounted ? ((theme === "system" ? resolvedTheme : theme) ?? "light") : "light";
  const isScattered = SCATTERED.has(mode);

  /**
   * The scatter layer has to be as tall as the DOCUMENT, not the viewport, so
   * its children's `%` offsets spread the finds down the whole page. There's no
   * CSS length for "height of the document", so it gets measured — and
   * re-measured, because the page grows as fonts and images land.
   */
  const [pageHeight, setPageHeight] = useState(0);
  /** Measured hiding spots; null until measured, or if no seams were found. */
  const [spots, setSpots] = useState<{ x: number; y: number }[] | null>(null);
  const scatterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScattered) return;

    const measure = () => {
      setPageHeight(document.documentElement.scrollHeight);

      const layer = scatterRef.current;
      if (!layer) return;
      const layerTop = layer.getBoundingClientRect().top + window.scrollY;
      const next = findHidingSpots(FUN_FACTS.length, layerTop);

      // Only swap when the layout actually moved: the observer below fires on
      // every re-render's layout pass, and a fresh array each time would spin.
      setSpots((prev) =>
        JSON.stringify(prev) === JSON.stringify(next) ? prev : next
      );
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isScattered]);

  // Rendering only after mount keeps the server HTML theme-agnostic.
  if (!mounted) return null;

  const particles = FIELDS[mode] ?? FIELDS.light;
  const isEaster = mode === "easter";
  const collectibles = COLLECTIBLES[mode] ?? null;
  const sky = SKY[mode] ?? null;
  const fact = open === null ? null : FUN_FACTS[open.index];

  return (
    <>
      {/* The decorative field, behind the content and inert in every theme. */}
      <div className="season-bg" aria-hidden="true">
        {particles.map((p, i) => (
          <span key={`${mode}-${i}`} className={p.className} style={p.style}>
            {p.char}
          </span>
        ))}
      </div>

      {/* The finds. Raised above the content so they can actually be clicked.
          Easter's spread down the whole document — hence the measured height —
          and the rest ring the viewport; either way they stay off the text. */}
      {collectibles && (
        <div
          ref={scatterRef}
          className={isScattered ? "season-scatter" : "season-bg season-bg--collect"}
          style={
            isScattered ? { height: `calc(${pageHeight}px - var(--scatter-top))` } : undefined
          }
          role="group"
          aria-label={
            isEaster
              ? "Easter egg hunt — hidden facts about Nitipon, scattered down the page"
              : "Hidden finds — each one opens a fact about Nitipon"
          }
        >
          {collectibles.map((p, i) => (
            <button
              key={`collect-${mode}-${i}`}
              type="button"
              className={`${p.className}${
                isEaster && found.has(i) ? " season-collect--found" : ""
              }`}
              style={
                // Measured seams win over the built-in positions once found.
                isScattered && spots?.[i]
                  ? ({
                      ...p.style,
                      "--x": `${round(spots[i].x)}%`,
                      "--y": `${round(spots[i].y)}px`,
                    } as CSSProperties)
                  : p.style
              }
              onClick={() => {
                setOpen({ index: i, source: "egg" });
                setFound((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
              }}
              aria-label={`Hidden egg ${i + 1} of ${FUN_FACTS.length}${
                found.has(i) ? " (already found)" : ""
              }`}
            >
              <EggMark index={i} />
            </button>
          ))}
        </div>
      )}

      {/* Flying finds — comets, or snowfall. These have to cross in
          FRONT of the content to read as movement at all, so they get their own
          layer. It's click-through apart from the items themselves. */}
      {sky && (
        <div
          className="season-bg season-bg--sky"
          role="group"
          aria-label="Moving finds — catch one to open a hidden fact about Nitipon"
        >
          {sky.flatMap((group) =>
            group.items.map((p, i) => (
              <button
                key={`${group.noun}-${i}`}
                type="button"
                className={p.className}
                style={p.style}
                onClick={() => revealRandom("sky")}
                aria-label={`Catch ${group.noun} ${i + 1} of ${group.items.length} for a hidden fact`}
              >
                {p.char}
              </button>
            ))
          )}
        </div>
      )}

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

            {/* The fact's own emoji lives here, in the card — not out on the
                page, where it would have given the answer away. */}
            <div className="mb-4 text-4xl" aria-hidden="true">
              {fact.emoji ?? <EggMark index={open!.index} className="egg-mark" />}
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

            {/* Distinct facts, never a tally of clicks — the random draw can
                repeat, and a click count would overstate progress. */}
            <p className="mt-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {open!.source === "egg" ? (
                <EggMark index={open!.index} className="egg-mark" />
              ) : (
                <span aria-hidden="true">✦</span>
              )}
              {found.size} of {FUN_FACTS.length} facts found
            </p>
          </div>
        </div>
      )}
    </>
  );
}
