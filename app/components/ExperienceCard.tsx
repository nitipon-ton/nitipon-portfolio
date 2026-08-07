"use client";

import { motion } from "framer-motion";

interface ExperienceCardProps {
  title: string;
  company?: string;
  desc: string[];
  tags: string[];
  img: string;
  link: string;
}

export default function ExperienceCard({
  title,
  company,
  desc,
  tags,
  img,
  link,
}: ExperienceCardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 210, damping: 18 }}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 dark:border-slate-700/80 dark:bg-slate-950/80"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-sky-400/20 to-indigo-400/15 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative z-10 p-6 sm:p-7">
        <div className="flex gap-4 items-start">
          {img && (
            <img
              src={img}
              alt={title}
              className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-slate-900/10 dark:shadow-none"
            />
          )}

          <div>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-base font-medium text-slate-600 dark:text-slate-300 mb-3">
              {company}
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {desc.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="badge-pill rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
