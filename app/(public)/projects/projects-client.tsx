"use client";

import { formatDate } from "@/lib/format-date";

import { motion } from "framer-motion";
import { WorkCard } from "@/components/work-card";
import { WorkTypewriter } from "@/components/work-typewriter";

export default function ProjectsClient({
  projects,
}: {
  projects: {
    id: string;
    title: string | null;
    description: string | null;
    imageId: string | null;
    createdAt: Date | null;
    link: string | null;
  }[];
}) {
  return (
    <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Projects
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans mb-6">
          Investigative projects, reporting series, interviews, and special
          field dispatches.
        </p>

        <WorkTypewriter />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((item, index) => (
          <WorkCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title || "",
              description: item.description || "",
              role: "Project",
              location: "",
              visual: item.imageId || undefined,
              date: formatDate(item.createdAt),
              url: item.link || "#",
            }}
            delay={index * 0.08}
          />
        ))}
      </div>
    </div>
  );
}
