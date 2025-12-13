"use client";

import { motion } from "framer-motion";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

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
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative block rounded-2xl overflow-hidden shadow-lg bg-white"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-lg transition duration-300" />

      {/* Card content */}
      <div className="relative z-10 rounded-2xl bg-white p-6 flex flex-col gap-4">
        
        {/* TOP ROW: icon + details */}
        <div className="flex gap-4 items-start">
          {img && (
            <img
              src={img}
              alt={title}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
            />
          )}

          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-1">
              {title}
            </h3>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {company}
            </h3>

            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {desc.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW: tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}