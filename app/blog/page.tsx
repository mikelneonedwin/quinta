"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/article-card";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Blog
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
          Essays, personal reflections, writing craft, and notes from the field.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <ArticleCard key={i} isLoading={true} title="" excerpt="" date="" href="" />
            ))
          : BLOG_POSTS.map((post, i) => (
              <ArticleCard 
                key={i} 
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                thumbnail={post.thumbnail}
                href={`/blog/${post.slug}`}
                delay={i * 0.08}
                isExternal={false}
              />
            ))}
      </div>

      {/* Newsletter subscription CTA at bottom of /blog */}
      <Card className="bg-card/90 backdrop-blur-xl border-border rounded-3xl shadow-lg relative overflow-hidden">
        <CardContent className="p-8 sm:p-12 relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="font-mono text-3xl font-bold mb-3 text-card-foreground">Newsletter</h2>
          <p className="text-base text-muted-foreground mb-8 leading-relaxed font-sans">
            Subscribe to receive new posts and dispatches straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Email address" 
              required
              className="w-full sm:w-auto sm:flex-1 max-w-sm bg-background font-sans"
            />
            <Button 
              type="submit"
              className="whitespace-nowrap cursor-pointer font-mono"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 font-sans">Free dispatch. Unsubscribe at any time.</p>
        </CardContent>
      </Card>
    </div>
  );
}
