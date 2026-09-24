import { google, gmail_v1 } from "googleapis";
import { GoogleDriveService } from "../storage";
export * from "./template";
export * from "./sender";

export interface SendEmailOptions {
  to: string;
  from?: string;
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
}

export class GmailService {
  private gmail: gmail_v1.Gmail;
  private defaultFrom?: string;

  constructor(accessToken: string, defaultFrom?: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: "v1", auth: oauth2Client });
    this.defaultFrom = defaultFrom;
  }

  static async fromSession(authIdentity?: import("../storage").AuthIdentity) {
    const { token, userEmail, userName } =
      await GoogleDriveService.getFreshTokenInfo(authIdentity);
    const defaultFrom = userEmail
      ? userName
        ? `${userName} <${userEmail}>`
        : userEmail
      : undefined;
    return new GmailService(token, defaultFrom);
  }

  private encodeEmail({
    to,
    from,
    bcc,
    subject,
    html,
    text,
  }: SendEmailOptions): string {
    const fromAddress = from || this.defaultFrom;
    const bodyContent = html || text || "";
    const isHtml = Boolean(html);
    const bodyBase64 = Buffer.from(bodyContent, "utf-8").toString("base64");

    const headers = [
      fromAddress ? `From: ${fromAddress}` : "",
      `To: ${to}`,
      bcc && bcc.length > 0 ? `Bcc: ${bcc.join(", ")}` : "",
      `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      isHtml
        ? 'Content-Type: text/html; charset="UTF-8"'
        : 'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
    ].filter(Boolean);

    // In RFC 2822 / 5322, headers and body MUST be separated by a blank line (\r\n\r\n)
    const fullMessage = `${headers.join("\r\n")}\r\n\r\n${bodyBase64}`;

    return Buffer.from(fullMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async sendEmail(
    optionsOrTo: SendEmailOptions | string,
    subject?: string,
    text?: string,
    from?: string,
  ) {
    const options: SendEmailOptions =
      typeof optionsOrTo === "object"
        ? optionsOrTo
        : {
            to: optionsOrTo,
            subject: subject || "",
            text: text || "",
            from,
          };

    const raw = this.encodeEmail(options);

    const res = await this.gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    return res.data;
  }
}
