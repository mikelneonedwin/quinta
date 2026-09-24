import type { MetadataRoute } from "next";
import { db } from "@/features/db";
import { env } from "@/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.BASE_URL;

  // Fetch internal articles with slugs for individual article pages (published only)
  const internalArticles = await db.query.articles.findMany({
    where: (articles, { eq, isNotNull, lte, and }) =>
      and(
        eq(articles.type, "internal"),
        isNotNull(articles.publishedAt),
        lte(articles.publishedAt, new Date()),
      ),
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
  });

  const articleUrls = internalArticles
    .filter((a) => a.slug)
    .map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.createdAt || new Date(),
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
