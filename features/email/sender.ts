import { db } from "../db";
import { subscribers } from "../db/schemas/cms";
import { isNull } from "drizzle-orm";
import { GmailService, generateArticleEmailHtml } from "./index";
import { getImageUrl } from "../../lib/image-url";
import { env } from "../../env";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe-token";
import type { AuthIdentity } from "../storage";

export interface SendNewsletterOptions {
  article: {
    id: string;
    title: string;
    excerpt?: string | null;
    slug: string;
    coverImageId?: string | null;
  };
  authIdentity?: AuthIdentity;
}

export async function dispatchNewsletter({
  article,
  authIdentity,
}: SendNewsletterOptions): Promise<{
  success: boolean;
  recipientCount: number;
  error?: string;
}> {
  try {
    const activeSubscribers = await db.query.subscribers.findMany({
      where: isNull(subscribers.unsubscribedAt),
    });

    const bccList = activeSubscribers.map((s) => s.email).filter(Boolean);

    if (bccList.length === 0) {
      return { success: true, recipientCount: 0 };
    }

    const coverImageUrl = article.coverImageId
      ? getImageUrl(article.coverImageId)
      : null;
    const absoluteCoverUrl = coverImageUrl?.startsWith("http")
      ? coverImageUrl
      : coverImageUrl
        ? `${env.BASE_URL}${coverImageUrl}`
        : null;

    const gmail = await GmailService.fromSession(authIdentity);

    let sentCount = 0;
    for (const subscriber of activeSubscribers) {
      if (!subscriber.email) continue;
      const unsubscribeUrl = buildUnsubscribeUrl(
        env.BASE_URL,
        subscriber.email,
      );
      const html = generateArticleEmailHtml({
        title: article.title,
        excerpt: article.excerpt,
        slug: article.slug,
        coverImageUrl: absoluteCoverUrl,
        baseUrl: env.BASE_URL,
        unsubscribeUrl,
      });

      await gmail.sendEmail({
        to: subscriber.email,
        subject: `New Article: ${article.title}`,
        html,
      });
      sentCount++;
    }

    return { success: true, recipientCount: sentCount };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to send newsletter";
    return { success: false, recipientCount: 0, error: message };
  }
}

export async function sendTestNewsletter({
  article,
  targetEmail,
  authIdentity,
}: {
  article: {
    title: string;
    excerpt?: string | null;
    slug?: string | null;
    coverImageId?: string | null;
  };
  targetEmail: string;
  authIdentity?: AuthIdentity;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const coverImageUrl = article.coverImageId
      ? getImageUrl(article.coverImageId)
      : null;
    const absoluteCoverUrl = coverImageUrl?.startsWith("http")
      ? coverImageUrl
      : coverImageUrl
        ? `${env.BASE_URL}${coverImageUrl}`
        : null;

    const unsubscribeUrl = buildUnsubscribeUrl(env.BASE_URL, targetEmail);

    const html = generateArticleEmailHtml({
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug || "preview",
      coverImageUrl: absoluteCoverUrl,
      baseUrl: env.BASE_URL,
      unsubscribeUrl,
    });

    const gmail = await GmailService.fromSession(authIdentity);
    await gmail.sendEmail({
      to: targetEmail,
      subject: `[Test Preview] ${article.title}`,
      html,
    });

    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to send test note";
    return { success: false, error: message };
  }
}
