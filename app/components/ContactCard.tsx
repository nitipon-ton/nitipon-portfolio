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
      className="group relative block rounded-2xl overflow-hidden shadow-lg bg-white"
    >
      {/* Glow border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-lg transition duration-300"></div>

      {/* Card content */}
      <div className="relative z-10 rounded-2xl bg-white p-5 flex items-center gap-4">
        {img && (
          <img
            src={img}
            alt={title}
            className="w-15 h-15 object-cover rounded-xl"
          />
        )}

        <div>
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">{title}</h3>
          <p className="text-gray-700">{desc}</p>
        </div>
      </div>
    </motion.a>
  );
}