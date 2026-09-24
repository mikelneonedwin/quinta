import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title"),
  slug: text("slug").unique(),
  content: text("content"), // TipTap JSON or HTML
  coverImageId: text("cover_image_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  type: text("type").default("internal"), // "internal" | "external"
  title: text("title"),
  slug: text("slug"),
  content: text("content"), // TipTap JSON or HTML for internal articles
  excerpt: text("excerpt"),
  publication: text("publication"), // e.g. "The Guardian", "Premium Times"
  link: text("link"), // External URL for external articles
  coverImageId: text("cover_image_id"),
  imageId: text("image_id"),
  publishedAt: timestamp("published_at"),
  newsletterSentAt: timestamp("newsletter_sent_at"),
  newsletterError: text("newsletter_error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
