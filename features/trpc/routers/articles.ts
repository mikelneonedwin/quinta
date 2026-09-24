import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../index";
import { articles } from "../../db/schemas/blog";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { dispatchNewsletter, sendTestNewsletter } from "../../email";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const articlesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const showDrafts = input?.includeDrafts && Boolean(ctx.session?.user);
      if (showDrafts) {
        return ctx.db.query.articles.findMany({
          orderBy: [desc(articles.updatedAt), desc(articles.createdAt)],
        });
      }
      return ctx.db.query.articles.findMany({
        where: (a, { isNotNull, lte, and }) =>
          and(isNotNull(a.publishedAt), lte(a.publishedAt, new Date())),
        orderBy: [desc(articles.publishedAt), desc(articles.updatedAt)],
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.slug, input.slug),
      });
      if (!article) return null;
      // Allow author to preview draft, otherwise hide from public
      if (!article.publishedAt && !ctx.session?.user) {
        return null;
      }
      return article;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.articles.findFirst({
        where: eq(articles.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["internal", "external"]).default("internal"),
        title: z.string().min(1, "Title is required"),
        slug: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        publication: z.string().optional(),
        link: z.string().optional(),
        coverImageId: z.string().optional(),
        publishedAt: z.date().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();
      const slug =
        input.type === "internal"
          ? input.slug || slugify(input.title) + "-" + id.substring(0, 6)
          : undefined;

      const isPublished = Boolean(input.publishedAt);
      let newsletterSentAt: Date | null = null;
      let newsletterError: string | null = null;

      // Automatically dispatch newsletter if publishing an internal article for the first time
      if (isPublished && input.type === "internal") {
        const result = await dispatchNewsletter({
          article: {
            id,
            title: input.title,
            excerpt: input.excerpt,
            slug: slug as string,
            coverImageId: input.coverImageId,
          },
          authIdentity: ctx.session,
        });

        if (result.success) {
          newsletterSentAt = new Date();
        } else {
          newsletterError = result.error || "Failed to send newsletter";
        }
      }

      await ctx.db.insert(articles).values({
        id,
        type: input.type,
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        publication: input.publication,
        link: input.link,
        coverImageId: input.coverImageId,
        imageId: input.coverImageId,
        publishedAt: input.publishedAt,
        newsletterSentAt,
        newsletterError,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      revalidatePath("/");
      revalidatePath("/articles");
      return { id, slug };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["internal", "external"]).default("internal"),
        title: z.string().min(1, "Title is required"),
        slug: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        publication: z.string().optional(),
        link: z.string().optional(),
        coverImageId: z.string().optional(),
        publishedAt: z.date().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const slug =
        data.type === "internal"
          ? data.slug || slugify(data.title) + "-" + id.substring(0, 6)
          : undefined;

      const existing = await ctx.db.query.articles.findFirst({
        where: eq(articles.id, id),
      });

      let newsletterSentAt = existing?.newsletterSentAt;
      let newsletterError = existing?.newsletterError;

      // If transitioning from draft to published on internal article and never sent, send now
      const isTransitioningToPublished =
        !existing?.publishedAt && Boolean(input.publishedAt);
      if (
        isTransitioningToPublished &&
        data.type === "internal" &&
        !newsletterSentAt
      ) {
        const result = await dispatchNewsletter({
          article: {
            id,
            title: data.title,
            excerpt: data.excerpt,
            slug: slug as string,
            coverImageId: data.coverImageId,
          },
          authIdentity: ctx.session,
        });

        if (result.success) {
          newsletterSentAt = new Date();
          newsletterError = null;
        } else {
          newsletterError = result.error || "Failed to send newsletter";
        }
      }

      await ctx.db
        .update(articles)
        .set({
          ...data,
          slug,
          imageId: data.coverImageId,
          newsletterSentAt,
          newsletterError,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id));

      revalidatePath("/");
      revalidatePath("/articles");
      if (slug) {
        revalidatePath(`/articles/${slug}`);
      }
      return { success: true };
    }),

  resendNewsletter: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.id, input.id),
      });

      if (!article) {
        throw new Error("Article not found");
      }
      if (article.type !== "internal" || !article.slug) {
        throw new Error("Newsletter can only be sent for internal articles");
      }

      const result = await dispatchNewsletter({
        article: {
          id: article.id,
          title: article.title || "Untitled",
          excerpt: article.excerpt,
          slug: article.slug,
          coverImageId: article.coverImageId || article.imageId,
        },
        authIdentity: ctx.session,
      });

      if (result.success) {
        await ctx.db
          .update(articles)
          .set({
            newsletterSentAt: new Date(),
            newsletterError: null,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, input.id));
        return { success: true, recipientCount: result.recipientCount };
      } else {
        await ctx.db
          .update(articles)
          .set({
            newsletterError: result.error,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, input.id));
        throw new Error(result.error || "Failed to send newsletter");
      }
    }),

  sendTestNewsletter: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        excerpt: z.string().optional(),
        slug: z.string().optional(),
        coverImageId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const targetEmail = ctx.session.user.email;
      if (!targetEmail) {
        throw new Error("Logged in user does not have an email address");
      }

      const result = await sendTestNewsletter({
        article: input,
        targetEmail,
        authIdentity: ctx.session,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to send test note");
      }

      return { success: true, email: targetEmail };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(articles).where(eq(articles.id, input.id));
      revalidatePath("/");
      revalidatePath("/articles");
      return { success: true };
    }),
});
