import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../../env";
import { db } from "../db";
import * as schema from "../db/schemas/auth"; // Will be generated

export const auth = betterAuth({
  baseURL: env.BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/gmail.send",
      ],
      validateUserInfo: async (userInfo: { email: string }) => {
        const allowedEmails = env.ALLOWED_EMAILS.split(",").map((e) =>
          e.trim().toLowerCase(),
        );
        if (!allowedEmails.includes(userInfo.email.toLowerCase())) {
          return {
            error: "email_not_allowed",
            errorDescription: "Use your main Google account to sign in",
          };
        }
      },
    },
  },
});
