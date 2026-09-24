export interface ArticleEmailPayload {
  title: string;
  excerpt?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  baseUrl: string;
  unsubscribeUrl?: string;
}

export function generateArticleEmailHtml({
  title,
  excerpt,
  slug,
  coverImageUrl,
  baseUrl,
  unsubscribeUrl,
}: ArticleEmailPayload): string {
  const articleUrl = `${baseUrl}/articles/${slug}`;
  const finalUnsubscribeUrl =
    unsubscribeUrl || `${baseUrl.replace(/\/+$/, "")}/unsubscribe`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background-color: #0d1117 !important;
      }
      .email-card {
        background-color: #161b22 !important;
        border-color: #374151 !important;
      }
      .email-title {
        color: #f9fafb !important;
      }
      .email-text {
        color: #e5e7eb !important;
      }
      .email-quote {
        color: #9ca3af !important;
        border-left-color: #f9fafb !important;
      }
      .email-author {
        color: #f9fafb !important;
      }
      .email-link {
        color: #ffffff !important;
      }
      .email-footer {
        background-color: #161b22 !important;
        border-top-color: #374151 !important;
        color: #9ca3af !important;
      }
      .email-footer-link {
        color: #9ca3af !important;
      }
    }
    /* Outlook app dark mode compatibility */
    [data-ogsc] .email-link {
      color: #ffffff !important;
    }
    [data-ogsc] .email-footer-link {
      color: #9ca3af !important;
    }
  </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #fdfbf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="email-bg" style="background-color: #fdfbf7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="email-card" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
          
          <!-- Article Thumbnail / Cover Image (if present) -->
          ${
            coverImageUrl
              ? `
          <tr>
            <td style="padding: 0; line-height: 0;">
              <img src="${coverImageUrl}" alt="${title}" width="580" style="display: block; width: 100%; max-width: 580px; height: auto; max-height: 320px; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px; border: 0;" />
            </td>
          </tr>
          `
              : ""
          }

          <!-- Main Letter Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <p class="email-text" style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 18px 0;">
                Hello,
              </p>
              
              <p class="email-text" style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 22px 0;">
                I wanted to share a new story I’ve recently written and published on the site:
              </p>

              <!-- Article Title -->
              <h1 class="email-title" style="font-family: monospace, Courier, monospace; font-size: 22px; font-weight: 700; color: #0a2540; line-height: 1.35; margin: 0 0 16px 0;">
                ${title}
              </h1>

              <!-- Excerpt / Note -->
              ${
                excerpt
                  ? `
              <p class="email-quote" style="font-size: 15px; line-height: 1.65; color: #4b5563; font-style: italic; border-left: 3px solid #0a2540; padding-left: 16px; margin: 0 0 28px 0;">
                “${excerpt}”
              </p>
              `
                  : `
              <p class="email-quote" style="font-size: 15px; line-height: 1.65; color: #4b5563; font-style: italic; border-left: 3px solid #0a2540; padding-left: 16px; margin: 0 0 28px 0;">
                Reflections and observations from recent reporting and writing.
              </p>
              `
              }

              <p class="email-text" style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 28px 0;">
                Whenever you have a quiet moment, you can read the full piece here:<br>
                <a href="${articleUrl}" target="_blank" class="email-link" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #0a2540; text-decoration: underline; text-underline-offset: 4px; word-break: break-all;">${articleUrl}</a>
              </p>

              <!-- Author Sign-off -->
              <div class="email-text" style="font-size: 15px; line-height: 1.6; color: #374151; margin-top: 8px;">
                Warmly,<br>
                <strong class="email-author" style="color: #0a2540;">Quinta Akpan</strong>
              </div>
            </td>
          </tr>

          <!-- Friendly Footer -->
          <tr>
            <td class="email-footer" style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; line-height: 1.6; color: #6b7280;">
              <p style="margin: 0 0 8px 0;">
                Thank you for reading and for making room in your inbox for my writing.
              </p>
              <p style="margin: 0; font-size: 11px;">
                <a href="${finalUnsubscribeUrl}" class="email-footer-link" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a> from these notes anytime.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
