import { NextResponse } from "next/server";
import { GoogleDriveService } from "@/features/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const driveService = await GoogleDriveService.fromSession(req);

    // Ensure public folder exists and get its ID
    const folderId = await driveService.ensurePublicFolder("quintas-portfolio");

    if (!folderId) {
      return NextResponse.json(
        { error: "Failed to create or access public folder" },
        { status: 500 },
      );
    }

    // Upload the file
    const uploadRes = await driveService.uploadImage(file, folderId);

    if (!uploadRes.id) {
      return NextResponse.json(
        { error: "Failed to upload file to Google Drive" },
        { status: 500 },
      );
    }

    // Ensure the file is publicly viewable
    await driveService.makeFilePublic(uploadRes.id);

    // Return the Google Drive file ID and direct proxy URL
    return NextResponse.json({
      id: uploadRes.id,
      url: `/api/drive-image?fileId=${uploadRes.id}`,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
