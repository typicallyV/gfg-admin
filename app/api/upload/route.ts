import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uploadSingleFile(buffer: Buffer, mimeType: string, folder: string): Promise<any> {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;
  return cloudinary.uploader.upload(dataUri, {
    resource_type: "auto",
    folder,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("file").filter(
      (entry): entry is File => entry instanceof File
    );

    if (files.length === 0) {
      return NextResponse.json({ error: "file(s) missing" }, { status: 400 });
    }

    const folder = (formData.get("folder") as string) ?? "";

    const results = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        return uploadSingleFile(Buffer.from(bytes), file.type, folder);
      })
    );

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "upload failed" },
      { status: 500 }
    );
  }
}
