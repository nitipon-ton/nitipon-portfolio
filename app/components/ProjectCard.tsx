"use client";

import { motion } from "framer-motion";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative block rounded-2xl overflow-hidden shadow-lg bg-white"
    >
      {/* Glow border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-lg transition duration-300"></div>

      {/* Card content */}
      <div className="relative z-10 rounded-2xl bg-white p-5">
        {img && (
          <img
            src={img}
            alt={title}
            className="w-full h-60 object-cover rounded-xl mb-4"
          />
        )}

        <h3 className="text-2xl font-semibold text-blue-700 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{desc}</p>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2">
          {tags.map((t: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
            <span
              key={i}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
