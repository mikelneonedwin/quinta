import { api, HydrateClient } from "@/features/trpc/server";
import ArticlesClient from "./articles-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Articles, essays, and publication features by Quinta Akpan.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Articles",
    description: "Articles, essays, and publication features by Quinta Akpan.",
    url: "/articles",
    type: "website",
  },
  twitter: {
    title: "Articles",
    description: "Articles, essays, and publication features by Quinta Akpan.",
    card: "summary_large_image",
  },
};

export default async function ArticlesPage() {
  const articles = await api.articles.getAll();

  return (
    <HydrateClient>
      <ArticlesClient articles={articles} />
    </HydrateClient>
  );
}
