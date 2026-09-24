import crypto from "crypto";
import { env } from "../env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  return crypto.createHash("sha256").update(env.BETTER_AUTH_SECRET).digest();
}

export interface DecryptedUnsubscribePayload {
  email: string;
  timestamp: number;
}

/**
 * Creates an encrypted, URL-safe token using BETTER_AUTH_SECRET as the private key.
 * This is 100% stateless and never stored in the database.
 */
export function createUnsubscribeToken(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const payload = JSON.stringify({
    email: cleanEmail,
    timestamp: Date.now(),
  } satisfies DecryptedUnsubscribePayload);

  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  // Combine IV (12B) + AuthTag (16B) + Encrypted data
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

/**
 * Parses and decrypts ("dehashes") the token back into its original payload.
 * Returns null if the token is tampered with, corrupted, or invalid.
 */
export function parseUnsubscribeToken(
  token: string,
): DecryptedUnsubscribePayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const buffer = Buffer.from(token, "base64url");
    if (buffer.length < IV_LENGTH + TAG_LENGTH) return null;

    const iv = buffer.subarray(0, IV_LENGTH);
    const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");

    const parsed = JSON.parse(decrypted) as DecryptedUnsubscribePayload;
    if (!parsed || typeof parsed.email !== "string") return null;

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verifies that the provided token decrypts successfully and matches the expected email.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const parsed = parseUnsubscribeToken(token);
  if (!parsed) return false;
  return parsed.email.toLowerCase().trim() === email.toLowerCase().trim();
}

/**
 * Builds the unsubscribe URL. If an email is provided, embeds the encrypted token.
 */
export function buildUnsubscribeUrl(baseUrl: string, email?: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  if (!email) {
    return `${cleanBase}/unsubscribe`;
  }
  const token = createUnsubscribeToken(email);
  return `${cleanBase}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
