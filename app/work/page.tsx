"use client";

import { motion } from "framer-motion";
import { WORK_ITEMS } from "@/lib/work-data";
import { WorkCard } from "@/components/work-card";
import { WorkTypewriter } from "@/components/work-typewriter";

export default function WorkPage() {
  return (
    <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Work
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans mb-6">
          Investigative projects, reporting series, interviews, and special field dispatches.
        </p>

        {/* Subtle, calm typewriter cycling through journalism coverage types */}
        <WorkTypewriter />
      </motion.div>

      {/* Grid of Work Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORK_ITEMS.map((item, index) => (
          <WorkCard key={item.id} item={item} delay={index * 0.08} />
        ))}
      </div>
    </div>
  );
}
