import { formatDate } from "@/lib/format-date";
import { estimateReadingTime } from "@/lib/reading-time";
import { getImageUrl } from "@/lib/image-url";
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter-form";
import { ArticleCard } from "@/components/article-card";
import { buttonVariants } from "@/components/ui/button";
import { ShareButton } from "@/components/share-button";
import type { Metadata } from "next";

import { api } from "@/features/trpc/server";

import { db } from "@/features/db";

export async function generateStaticParams() {
  const publishedArticles = await db.query.articles.findMany({
    where: (a, { and, eq, isNotNull }) =>
      and(eq(a.type, "internal"), isNotNull(a.publishedAt)),
    columns: { slug: true },
  });
  return publishedArticles
    .filter((article) => Boolean(article.slug))
    .map((article) => ({
      slug: article.slug as string,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.articles.getBySlug({ slug });
  if (!post) return { title: "Article Not Found" };

  const description =
    post.excerpt ||
    (post.content
      ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 160)
      : "") ||
    "Read this article on Quinta Akpan's site.";

  const imageUrl = post.coverImageId
    ? getImageUrl(post.coverImageId)
    : undefined;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: post.title || "Article",
      description,
      url: `/articles/${slug}`,
      type: "article",
      publishedTime:
        post.publishedAt?.toISOString() || post.createdAt?.toISOString(),
      authors: ["Quinta Akpan"],
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      title: post.title || "Article",
      description,
      card: imageUrl ? "summary_large_image" : "summary",
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await api.articles.getBySlug({ slug });

  if (!post) {
    notFound();
  }

  const [allPosts, settings] = await Promise.all([
    api.articles.getAll(),
    api.cms.getSettings(),
  ]);
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const authorName = settings.name || "Quinta Akpan";
  const authorTag = settings.heroTag || "Journalist & Writer";
  const authorLocation = settings.location || "";
  const authorPortrait = settings.portraitId
    ? getImageUrl(settings.portraitId)
    : null;

  return (
    <article className="w-[92%] sm:w-[85%] lg:w-[80%] max-w-3xl mx-auto py-12">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/articles"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className:
              "-ml-3 text-muted-foreground hover:text-foreground font-mono inline-flex items-center",
          })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Link>
      </div>

      {/* Header / Metadata */}
      <header className="mb-10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {estimateReadingTime(post.content)} min read
          </span>
        </div>

        <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-6">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 font-sans">
            {post.excerpt}
          </p>
        ) : post.content ? (
          <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 font-sans">
            {post.content.replace(/<[^>]*>?/gm, "").substring(0, 160)}...
          </p>
        ) : null}

        {/* Author Byline */}
        <div className="flex items-center gap-3 mt-8">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
            {authorPortrait ? (
              <img
                src={authorPortrait}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className="text-sm font-mono font-semibold text-foreground block">
              {authorName}
            </span>
            <span className="text-xs text-muted-foreground block font-sans">
              {[authorTag, authorLocation].filter(Boolean).join(" in ")}
            </span>
          </div>
          <div className="ml-auto">
            <ShareButton title={post.title || "Blog Post"} />
          </div>
        </div>
      </header>

      {post.coverImageId && (
        <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden mb-10 border border-border">
          <img
            src={post.coverImageId}
            alt={post.title || ""}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      {post.content && /<[a-z][\s\S]*>/i.test(post.content) ? (
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-foreground/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-foreground/90 leading-relaxed space-y-6">
          {(post.content || "").split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("1. ") || paragraph.startsWith("2. ")) {
              return (
                <p
                  key={index}
                  className="text-base sm:text-lg leading-relaxed pl-4 border-l border-border"
                >
                  {paragraph}
                </p>
              );
            }
            return (
              <p key={index} className="text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      )}

      {/* Newsletter Signup CTA */}
      <NewsletterForm />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-10">
          <h3 className="font-mono text-xl font-bold mb-6 text-foreground">
            More Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related, i) => (
              <ArticleCard
                key={i}
                title={related.title || ""}
                excerpt={
                  related.excerpt ||
                  (related.content
                    ? related.content
                        .replace(/<[^>]*>?/gm, "")
                        .substring(0, 160)
                    : "") ||
                  ""
                }
                date={formatDate(related.publishedAt || related.createdAt)}
                thumbnail={related.coverImageId || undefined}
                href={
                  related.type === "external"
                    ? related.link || "#"
                    : `/articles/${related.slug}`
                }
                delay={i * 0.08}
                isExternal={related.type === "external"}
                source={
                  related.type === "external"
                    ? related.publication || "Feature"
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
