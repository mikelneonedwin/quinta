"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WorkItem } from "@/lib/work-data";

export function WorkCard({
  item,
  delay = 0,
}: {
  item: WorkItem;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        <Card className="h-full min-h-[340px] flex flex-col justify-between overflow-hidden bg-card/80 border-border/80 rounded-2xl transition-all duration-300 hover:border-border hover:shadow-lg p-6">
          <div className="space-y-4">
            {/* Field/Assignment Image Preview */}
            {item.visual && (
              <div className="rounded-xl overflow-hidden aspect-video w-full bg-muted relative -mt-1 mb-4">
                <img
                  src={item.visual}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            )}

            {/* Publication & Role */}
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{item.role}</span>
            </div>

            {/* Investigation / Project Title */}
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug">
              {item.title}
            </h3>

            {/* Location & Date */}
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                {item.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary shrink-0" />
                {item.date}
              </span>
            </div>

            {/* Summary / Impact */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>

          {/* View Dispatch / Report Link */}
          <div className="pt-6 mt-auto border-t border-border/40">
            <span className="inline-flex items-center text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              view report
            </span>
          </div>
        </Card>
      </a>
    </motion.div>
  );
}
