import { NextResponse } from "next/server";
import { GoogleDriveService } from "@/features/storage";
import { env } from "@/env";

export async function GET(req: Request) {
  try {
    const accessToken = await GoogleDriveService.getFreshToken(req);
    const appId = env.GOOGLE_CLIENT_ID.split("-")[0];

    return NextResponse.json({
      accessToken,
      clientId: env.GOOGLE_CLIENT_ID,
      appId,
    });
  } catch (error: unknown) {
    console.error("Picker token error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get Google Drive token",
      },
      { status: 401 },
    );
  }
}
