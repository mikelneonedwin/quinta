import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  heroTag: text("hero_tag"),
  heroText: text("hero_text"),
  name: text("name"),
  portraitId: text("portrait_id"), // Will store Google Drive file ID or public URL
  aboutText: text("about_text"),
  location: text("location"),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  imageId: text("image_id"), // Google Drive file ID
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactPlatforms = [
  "X",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Email",
  "Phone",
  "Substack",
  "YouTube",
  "GitHub",
  "TikTok",
  "Website",
] as const;

export type ContactPlatform = (typeof contactPlatforms)[number];

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  platform: text("platform", { enum: contactPlatforms }).notNull(),
  value: text("value").notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});
