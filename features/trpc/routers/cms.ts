import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../index";
import {
  siteSettings,
  contacts,
  contactPlatforms,
  subscribers,
} from "../../db/schemas/cms";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export const cmsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => {
    let settings = await ctx.db.query.siteSettings.findFirst();
    if (!settings) {
      const defaultRecord = {
        id: "default",
        heroTag: "Journalist & Writer",
        heroText: "Uncovering stories that shape our world.",
        name: "Quinta Akpan",
        portraitId: null,
        aboutText: "Dedicated to rigorous, on-the-ground reporting.",
        location: "Uyo, Nigeria",
      };
      await ctx.db.insert(siteSettings).values(defaultRecord);
      settings = defaultRecord;
    }
    return settings;
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        heroTag: z.string().min(1),
        heroText: z.string().min(1),
        name: z.string().min(1),
        aboutText: z.string().min(1),
        location: z.string().min(1),
        portraitId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.siteSettings.findFirst();
      if (existing) {
        await ctx.db
          .update(siteSettings)
          .set({ ...input })
          .where(eq(siteSettings.id, existing.id));
      } else {
        await ctx.db.insert(siteSettings).values({ id: "default", ...input });
      }
      revalidatePath("/");
      revalidatePath("/dashboard");
      revalidatePath("/projects");
      return { success: true };
    }),

  getContacts: publicProcedure.query(async ({ ctx }) => {
    const existing = await ctx.db.query.contacts.findMany();
    return existing ?? [];
  }),

  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const cleanEmail = input.email.toLowerCase().trim();
      const existing = await ctx.db.query.subscribers.findFirst({
        where: (s, { eq }) => eq(s.email, cleanEmail),
      });
      if (!existing) {
        await ctx.db.insert(subscribers).values({
          id: uuidv4(),
          email: cleanEmail,
          subscribedAt: new Date(),
        });
      } else if (existing.unsubscribedAt) {
        await ctx.db
          .update(subscribers)
          .set({ unsubscribedAt: null, subscribedAt: new Date() })
          .where(eq(subscribers.id, existing.id));
      }
      return { success: true };
    }),

  resolveUnsubscribeToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { parseUnsubscribeToken } =
        await import("../../../lib/unsubscribe-token");
      const parsed = parseUnsubscribeToken(input.token);
      if (!parsed) {
        return { valid: false, email: null };
      }
      return { valid: true, email: parsed.email };
    }),

  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cleanEmail = input.email.trim().toLowerCase();
      if (input.token) {
        const { verifyUnsubscribeToken } =
          await import("../../../lib/unsubscribe-token");
        const valid = verifyUnsubscribeToken(cleanEmail, input.token);
        if (!valid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired unsubscribe link.",
          });
        }
      }

      await ctx.db
        .update(subscribers)
        .set({ unsubscribedAt: new Date() })
        .where(eq(subscribers.email, cleanEmail));

      return { success: true };
    }),

  updateContacts: protectedProcedure
    .input(
      z.array(
        z.object({
          platform: z.enum(contactPlatforms),
          value: z.string().min(1),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // For simplicity, delete all and re-insert
      await ctx.db.delete(contacts);

      if (input.length > 0) {
        await ctx.db
          .insert(contacts)
          .values(
            input.map((c) => ({
              id: uuidv4(),
              platform: c.platform,
              value: c.value,
            })),
          );
      }
      revalidatePath("/");
      revalidatePath("/dashboard");
      return { success: true };
    }),
});
