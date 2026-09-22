"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AnimatedWave() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {/* Light mode blobs */}
      {!isDark && (
        <>
          <motion.div
            animate={{
              x: ["0%", "20%", "-20%", "0%"],
              y: ["0%", "-20%", "20%", "0%"],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-slate-200/50 mix-blend-multiply blur-3xl opacity-50"
          />
          <motion.div
            animate={{
              x: ["0%", "-20%", "20%", "0%"],
              y: ["0%", "20%", "-20%", "0%"],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/50 mix-blend-multiply blur-3xl opacity-50"
          />
        </>
      )}

      {/* Dark mode blobs */}
      {isDark && (
        <>
          <motion.div
            animate={{
              x: ["0%", "20%", "-20%", "0%"],
              y: ["0%", "-20%", "20%", "0%"],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-slate-800/30 mix-blend-screen blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              x: ["0%", "-20%", "20%", "0%"],
              y: ["0%", "20%", "-20%", "0%"],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/20 mix-blend-screen blur-3xl opacity-30"
          />
        </>
      )}
    </div>
  );
}
