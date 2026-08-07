"use client";

import { motion } from "framer-motion";

interface ContactCardProps {
  title: string;
  desc: string;
  img: string;
  link: string;
}

export default function ContactCard({ title, desc, img, link }: ContactCardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 dark:border-slate-700/80 dark:bg-slate-950/80"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-sky-400/20 to-cyan-400/15 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center gap-4">
        {img && (
          <img
            src={img}
            alt={title}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        )}

        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {desc}
          </p>
        </div>
      </div>
    </motion.a>
  );
}
