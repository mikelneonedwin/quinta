"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image-url";
import { ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  source?: string;
  href: string;
  thumbnail?: string | null;
  delay?: number;
  isLoading?: boolean;
  isExternal?: boolean;
}

export function ArticleCard({
  title,
  excerpt,
  date,
  source,
  href,
  thumbnail,
  delay = 0,
  isLoading = false,
  isExternal = false,
}: ArticleCardProps) {
  if (isLoading) {
    return (
      <Card className="h-[360px] flex flex-col overflow-hidden bg-card/60 border-border">
        <CardHeader className="gap-2 pb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="flex-1">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const imageUrl = thumbnail ? getImageUrl(thumbnail) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Link
        href={href}
        {...linkProps}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl group cursor-pointer"
      >
        {imageUrl ? (
          <Card className="h-full min-h-[360px] flex flex-col justify-between overflow-hidden relative border-border/80 bg-card rounded-2xl p-0 py-0 gap-0 transition-all duration-500 hover:shadow-2xl hover:border-border select-none">
            {/* Base Background Image Layer (Unblurred & Zoomable) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Progressive Blur Layer */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none backdrop-blur-[6px] overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Smooth Directional Gradient Shade */}
            <div
              className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-500 group-hover:opacity-95"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.2) 35%, rgba(0, 0, 0, 0.6) 65%, rgba(0, 0, 0, 0.85) 100%)",
              }}
            />

            {/* Top metadata overlay */}
            <div className="relative z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-0 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] uppercase tracking-wider">
                {date}
              </span>
              {source && (
                <Badge
                  variant="outline"
                  className="text-[11px] font-mono bg-black/30 text-white border-white/20 backdrop-blur-xs font-normal"
                >
                  {source}
                </Badge>
              )}
            </div>

            {/* Bottom Card Content */}
            <div className="relative z-10 mt-auto px-5 sm:px-6 pt-2 pb-4 sm:pb-5 flex flex-col justify-end">
              <h3 className="font-mono text-xl sm:text-2xl font-bold leading-snug text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {title}
              </h3>

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-3">
                {excerpt}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="h-full min-h-[340px] flex flex-col justify-between overflow-hidden bg-card/80 border-border/80 rounded-2xl transition-all duration-300 hover:border-border hover:shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">{date}</span>
                {source && (
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-mono font-normal"
                  >
                    {source}
                  </Badge>
                )}
              </div>

              <h3 className="font-mono text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug">
                {title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans">
                {excerpt}
              </p>
            </div>

            <div className="pt-6 mt-auto border-t border-border/40">
              <span className="inline-flex items-center text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                <ArrowUpRight className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Read
              </span>
            </div>
          </Card>
        )}
      </Link>
    </motion.div>
  );
}
