"use client";

import { formatDate } from "@/lib/format-date";

import { ArticleCard } from "@/components/article-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { motion } from "framer-motion";

interface ArticleItem {
  id: string;
  type: string | null;
  title: string | null;
  slug?: string | null;
  content?: string | null;
  excerpt?: string | null;
  publication?: string | null;
  link?: string | null;
  coverImageId?: string | null;
  imageId?: string | null;
  publishedAt?: Date | null;
  createdAt?: Date | null;
}

export default function ArticlesClient({
  articles,
}: {
  articles: ArticleItem[];
}) {
  return (
    <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Articles
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
          Investigative reports, cultural commentary, essays, and notes from the
          field.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {articles.map((article, i) => {
          const isExternal = article.type === "external";
          const href = isExternal
            ? article.link || "#"
            : `/articles/${article.slug}`;

          const excerpt =
            article.excerpt ||
            (article.content
              ? article.content.replace(/<[^>]*>?/gm, "").substring(0, 160) +
                "..."
              : "");

          const thumbnail =
            article.coverImageId || article.imageId || undefined;

          return (
            <ArticleCard
              key={article.id || i}
              title={article.title || ""}
              excerpt={excerpt}
              date={formatDate(article.publishedAt || article.createdAt)}
              thumbnail={thumbnail}
              href={href}
              delay={i * 0.08}
              isExternal={isExternal}
              source={isExternal ? article.publication || "Feature" : undefined}
            />
          );
        })}
        {articles.length === 0 && (
          <div className="col-span-full text-muted-foreground">
            No articles published yet.
          </div>
        )}
      </div>

      <NewsletterForm
        title="Newsletter"
        subtitle="Subscribe to receive new posts and dispatches straight to your inbox."
      />
    </div>
  );
}
