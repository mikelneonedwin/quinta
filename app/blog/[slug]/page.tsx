import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { NewsletterForm } from "@/components/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/article-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Quinta Akpan`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="w-[92%] sm:w-[85%] lg:w-[80%] max-w-3xl mx-auto py-12">
      {/* Back Link */}
      <div className="mb-8">
        <Button  variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground font-mono">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Header / Metadata */}
      <header className="mb-10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="text-xs font-mono font-semibold uppercase tracking-wider">
            {post.category}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-6">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 font-sans">
          {post.excerpt}
        </p>

        {/* Author Byline */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop"
              alt="Quinta Akpan"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-mono font-semibold text-foreground block">
              Quinta Akpan
            </span>
            <span className="text-xs text-muted-foreground block font-sans">
              Journalist & Writer in Uyo, Nigeria
            </span>
          </div>
        </div>
      </header>

      {post.thumbnail && (
        <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden mb-10 border border-border">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <Separator className="mb-10" />

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-foreground/90 leading-relaxed space-y-6">
        {post.content.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("1. ") || paragraph.startsWith("2. ")) {
            return (
              <p key={index} className="text-base sm:text-lg leading-relaxed pl-4 border-l border-border">
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

      {/* Newsletter Signup CTA */}
      <NewsletterForm />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border pt-10">
          <h3 className="font-mono text-xl font-bold mb-6 text-foreground">More from the Blog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related, i) => (
              <ArticleCard 
                key={i} 
                title={related.title}
                excerpt={related.excerpt}
                date={related.date}
                thumbnail={related.thumbnail}
                href={`/blog/${related.slug}`}
                delay={i * 0.08}
                isExternal={false}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
