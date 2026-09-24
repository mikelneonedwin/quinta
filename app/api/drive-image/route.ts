import { NextResponse } from "next/server";
import { GoogleDriveService } from "@/features/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "Missing fileId parameter" },
        { status: 400 },
      );
    }

    const driveService = await GoogleDriveService.fromSession(req);
    const { buffer, mimeType } = await driveService.getFileBuffer(fileId);

    // Make the file publicly viewable so direct URLs or cached views work everywhere
    await driveService.makeFilePublic(fileId);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error: unknown) {
    console.error("Drive image fetch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Google Drive image",
      },
      { status: 500 },
    );
  }
}
