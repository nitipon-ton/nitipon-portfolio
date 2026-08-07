"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  desc: string;
  tags: string[];
  img: string;
  link: string;
}

export default function ProjectCard({ title, desc, tags, img, link }: ProjectCardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 210, damping: 18 }}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 dark:border-slate-700/80 dark:bg-slate-950/80"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-sky-400/25 to-indigo-400/15 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative z-10 p-5 sm:p-6">
        {img && (
          <img
            src={img}
            alt={title}
            className="mb-5 h-60 w-full rounded-[1.5rem] object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        <h3 className="text-2xl font-semibold text-slate-950 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-base leading-7 text-slate-600 dark:text-slate-300 mb-5">
          {desc}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="badge-pill px-3 py-1.5 text-sm font-medium text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
