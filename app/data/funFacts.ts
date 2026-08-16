/**
 * Fun facts revealed by the clickable eggs in Easter mode.
 *
 * ─────────────────────────────────────────────────────────────
 *  TO ADD A FACT: just append an entry to the array below.
 *  One egg is rendered per fact, positioned automatically —
 *  no other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export type FunFact = {
  /** Short headline shown at the top of the popup. */
  title: string;
  /** The fact itself. */
  fact: string;
  /** Optional: overrides the egg emoji for this one. */
  emoji?: string;
  /** Optional: a "see it" link at the bottom of the popup. */
  link?: { label: string; href: string };
};

export const FUN_FACTS: FunFact[] = [
  {
    title: "#1 in Thailand",
    fact: "Won the King's Scholarship in 2022 — a full Thai government undergraduate scholarship — ranking first in the entire country.",
    emoji: "👑",
  },
  {
    title: "Top Putnam scorer at Georgia Tech",
    fact: "Placed 1st at Georgia Tech in the 2024 Putnam Math Competition, finishing #126 overall among thousands of competitors across North America — the first Georgia Tech student to crack the top 200 in a decade.",
    link: {
      label: "Official results",
      href: "https://kskedlaya.org/putnam-archive/AnnouncementOfWinners2024.pdf",
    },
  },
  {
    title: "Then did it again",
    fact: "Backed it up the following year: 2nd at Georgia Tech in the 2025 Putnam, #231 overall.",
    link: {
      label: "Official results",
      href: "https://kskedlaya.org/putnam-archive/AnnouncementOfWinners2025.pdf",
    },
  },
  {
    title: "Cashing in on math",
    fact: "Won 100,000 THB (about US$3,000) at a Thai math competition in 2019 — still the largest cash prize taken home from any competition.",
    emoji: "💰",
  },
  {
    title: "Everyone starts somewhere",
    fact: "Entered a first math competition back in 2009 and came away with nothing at all — a reminder that every medal below started with losing.",
    emoji: "🌱",
  },
  {
    title: "First time abroad",
    fact: "Competed overseas for the first time in 2011, taking a Gold Medal at a math competition in the Philippines.",
    emoji: "✈️",
  },
  {
    title: "The first step",
    fact: "Took a first Math title in grade 3, competing individually at Petch Yod Mongkut (เพชรยอดมงกุฎ) 2012 — one of Thailand's most prestigious academic competitions, and the spark for everything that followed.",
    emoji: "🧮",
  },
  {
    title: "Both crowns",
    fact: "Won a Science title in grade 6 on the school team at Petch Yod Mongkut (เพชรยอดมงกุฎ) 2015 — and with the Math title already taken in 2012, joined the very few ever to win both at one of Thailand's most prestigious academic competitions.",
    emoji: "🔬",
  },
  {
    title: "Gold in two subjects at once",
    fact: "Won gold in both Math and Science at the ASMO national round in grade 7 — one of the very few to take gold in both subjects in the same year.",
    emoji: "🧪",
  },
  {
    title: "The only one that year",
    fact: "Took gold in both Math and Science at TEDET in grade 8 — one of the very few ever to manage both nationally, and the only student in the country to do it that year.",
    emoji: "🎖️",
  },
  {
    title: "2nd in the country",
    fact: "At the end of grade 9, placed 2nd nationally on the entrance examination for the science-math program at Triam Udom Suksa (เตรียมอุดมศึกษา) — Thailand's most selective high school.",
    emoji: "📝",
  },
  {
    title: "Three perfect papers",
    fact: "Sat Thailand's 2022 university admission exams alongside roughly 100,000 other students and came away with three perfect papers — Math, Physics, and Science — when no one else in the country managed more than one. Placed 1st nationally in four subjects and 2nd in two others.",
    emoji: "💯",
  },
  {
    title: "A record no one can break",
    fact: "Scored full marks on the Science paper of Thailand's 2022 university admission exams — the only student in the country's history to do so. The format was retired in 2023, so that paper will never be sat again.",
    emoji: "🔒",
  },
  {
    title: "A clean sweep",
    fact: "At the Thailand Earth Science Olympiad 2021, took the Gold Medal AND was top scorer in Theory, Practical, and Overall — all three at once.",
    emoji: "🥇",
    link: { label: "Watch the video", href: "https://www.youtube.com/watch?v=Nf3iNb-cXEk" },
  },
  {
    title: "Silver on the world stage",
    fact: "Silver medalist at the International Earth Science Olympiad 2021, representing Thailand.",
    link: {
      label: "Official results",
      href: "https://www.igeoscied.org/wp-content/uploads/2022/11/2021-DMT_TOTAL-DISTINCTION-RANKING-IESO.pdf",
    },
  },
  {
    title: "ITMO gold at 15",
    fact: "Gold Medal at the International Teenagers Mathematics Olympiad 2019.",
    emoji: "🏅",
  },
  {
    title: "Bulgaria, 2018",
    fact: "Silver Medal at the Bulgaria International Mathematics Competition — an early taste of international math.",
    link: { label: "Official results", href: "https://chiuchang.org/imc/en/2018/07/24/bimc-2018-results-2/" },
  },
  {
    title: "3.45 guesses, every time",
    fact: "Built a Wordle bot using expectimax and minimax that averages 3.45 guesses — solving 99% of puzzles within 4 guesses and 100% within 5.",
    emoji: "🟩",
    link: { label: "Try it", href: "https://wordle-analyzer-nu.vercel.app/" },
  },
  {
    title: "Beats most humans at Yahtzee",
    fact: "Wrote a probability-optimized Yahtzee engine combining dynamic simulation with strategy heuristics. It reliably outplays human opponents.",
    emoji: "🎲",
    link: { label: "Play against it", href: "https://yahtzee-tony.vercel.app/" },
  },
  {
    title: "Hackathon podium",
    fact: "Took 3rd place in the Databricks Challenge at Hacklytics 2026 with “Data Saves Lives”, unifying messy humanitarian datasets into reliable crisis analytics.",
    emoji: "🏆",
    link: { label: "See the project", href: "https://devpost.com/software/data-saves-lives-dsl" },
  },
  {
    title: "Teaching since 2022",
    fact: "Has run a private STEM tutoring practice since 2022 — 10+ students every semester across Mathematics, Physics, Computer Science, Chemistry, Earth Science, and Astronomy.",
    emoji: "📚",
  },
  {
    title: "20 hours to a scholarship",
    fact: "Designed a Mathematics crash course that prepared students for the King's Scholarship exam in just 20 hours of instruction.",
    emoji: "⏱️",
  },
  {
    title: "Two in a decade",
    fact: "Won the Math title at the International Mathematics and Science Olympiad (IMSO) 2016 in Tangerang, Indonesia — a first international title, and the first time a Thai representative had won IMSO away from home. Another Thai had taken it on home soil the year before, and no one from Thailand has won IMSO Math in the decade since.",
    emoji: "🌏",
  },
  {
    title: "Was on TV at 12",
    fact: "Winning the International Mathematics and Science Olympiad in 2016 led to an interview on Woody TV — national television, at twelve years old.",
    emoji: "📺",
    link: { label: "Watch it", href: "https://www.youtube.com/watch?v=3T3WGz0uphA" },
  },
  {
    title: "Back at it",
    fact: "Placed 8th individually and 5th in the Constellation Round at ICMT 2026, Division B.",
    emoji: "⭐",
    link: { label: "Official results", href: "https://intercollegiatemathtournament.org/archives/2026/" },
  },
];
