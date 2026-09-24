import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";
import { auth } from "../auth";
import { env } from "../../env";
import { db } from "../db";
import { account as accountTable, user as userTable } from "../db/schemas/auth";
import { eq, and } from "drizzle-orm";

export type AuthIdentity =
  | Request
  | string
  | {
      user?: { id?: string; email?: string | null; name?: string | null };
      session?: unknown;
      userId?: string;
      userEmail?: string | null;
      userName?: string | null;
      req?: Request;
      headers?: Headers;
    }
  | null
  | undefined;

export class GoogleDriveService {
  public drive: drive_v3.Drive;
  public accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    this.drive = google.drive({ version: "v3", auth: oauth2Client });
  }

  static async getFreshTokenInfo(
    authIdentity?: AuthIdentity,
  ): Promise<{ token: string; userEmail?: string; userName?: string }> {
    let userId: string | null = null;
    let fallbackReq: Request | undefined = undefined;

    if (typeof authIdentity === "string") {
      userId = authIdentity;
    } else if (authIdentity instanceof Request) {
      fallbackReq = authIdentity;
    } else if (authIdentity && typeof authIdentity === "object") {
      if ("userId" in authIdentity && typeof authIdentity.userId === "string") {
        userId = authIdentity.userId;
      } else if ("user" in authIdentity && authIdentity.user?.id) {
        userId = authIdentity.user.id;
      } else if (
        "session" in authIdentity &&
        authIdentity.session &&
        typeof authIdentity.session === "object"
      ) {
        const s = authIdentity.session as Record<string, unknown>;
        if (typeof s.userId === "string") {
          userId = s.userId;
        } else if (
          s.user &&
          typeof s.user === "object" &&
          "id" in s.user &&
          typeof (s.user as { id?: unknown }).id === "string"
        ) {
          userId = (s.user as { id: string }).id;
        }
      }

      if ("req" in authIdentity && authIdentity.req instanceof Request) {
        fallbackReq = authIdentity.req;
      } else if (
        "headers" in authIdentity &&
        authIdentity.headers instanceof Headers
      ) {
        try {
          const session = await auth.api.getSession({
            headers: authIdentity.headers,
          });
          if (session?.user?.id) {
            userId = session.user.id;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!userId && fallbackReq) {
      try {
        const session = await auth.api.getSession({
          headers: fallbackReq.headers,
        });
        if (session?.user?.id) {
          userId = session.user.id;
        }
      } catch {
        // Unauthenticated request, proceed to fallback
      }
    }

    let userAccount = null;

    if (userId) {
      const accounts = await db
        .select()
        .from(accountTable)
        .where(
          and(
            eq(accountTable.userId, userId),
            eq(accountTable.providerId, "google"),
          ),
        )
        .limit(1);
      userAccount = accounts[0];

      if (!userAccount) {
        throw new Error(
          `No connected Google account found for user (${userId}). Please sign in with Google.`,
        );
      }
    } else {
      const accounts = await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.providerId, "google"))
        .limit(1);
      userAccount = accounts[0];
    }

    if (
      !userAccount ||
      (!userAccount.accessToken && !userAccount.refreshToken)
    ) {
      throw new Error("No Google access token found");
    }

    const matchedUser = await db.query.user.findFirst({
      where: eq(userTable.id, userAccount.userId),
    });

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
    );

    const isExpired =
      !userAccount.accessTokenExpiresAt ||
      userAccount.accessTokenExpiresAt.getTime() <= Date.now() + 60000;

    oauth2Client.setCredentials({
      access_token: userAccount.accessToken || undefined,
      refresh_token: userAccount.refreshToken || undefined,
      expiry_date: userAccount.accessTokenExpiresAt?.getTime(),
    });

    let token = userAccount.accessToken;

    if (isExpired && userAccount.refreshToken) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      token = credentials.access_token || token;

      const newExpiry = credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : undefined;
      await db
        .update(accountTable)
        .set({
          accessToken: token,
          refreshToken: credentials.refresh_token || userAccount.refreshToken,
          accessTokenExpiresAt: newExpiry,
          updatedAt: new Date(),
        })
        .where(eq(accountTable.id, userAccount.id));
    } else if (!token) {
      const tokenRes = await oauth2Client.getAccessToken();
      token = tokenRes.token || null;
    }

    if (!token) {
      throw new Error("Failed to obtain fresh Google access token");
    }

    return {
      token,
      userEmail: matchedUser?.email || undefined,
      userName: matchedUser?.name || undefined,
    };
  }

  static async getFreshToken(authIdentity?: AuthIdentity): Promise<string> {
    const { token } = await GoogleDriveService.getFreshTokenInfo(authIdentity);
    return token;
  }

  static async fromSession(authIdentity?: AuthIdentity) {
    const token = await GoogleDriveService.getFreshToken(authIdentity);
    return new GoogleDriveService(token);
  }

  async ensurePublicFolder(folderName: string = "quintas-portfolio") {
    // 1. Check if folder exists
    const res = await this.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    let folderId = res.data.files?.[0]?.id;

    // 2. If not, create it
    if (!folderId) {
      const createRes = await this.drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      folderId = createRes.data.id;

      // 3. Make the folder public so anyone can view the images
      if (folderId) {
        await this.drive.permissions.create({
          fileId: folderId,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
      }
    }

    return folderId;
  }

  async makeFilePublic(fileId: string) {
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (err) {
      console.warn("Permission may already exist or cannot be modified:", err);
    }
  }

  async getFileBuffer(
    fileId: string,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const meta = await this.drive.files.get({
      fileId,
      fields: "mimeType, name",
    });

    const res = await this.drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" },
    );

    return {
      buffer: Buffer.from(res.data as ArrayBuffer),
      mimeType: meta.data.mimeType || "image/jpeg",
    };
  }

  async uploadImage(file: File, folderId: string) {
    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));
    const res = await this.drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.type || "image/jpeg",
        body: stream,
      },
      fields: "id, webViewLink, webContentLink",
    });

    return res.data;
  }
}
