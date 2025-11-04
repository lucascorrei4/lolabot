import { NextRequest, NextResponse } from "next/server";
import { putObject, getPublicUrl, getSignedUrl } from "../../../lib/storage/s3";
import { recordUpload } from "../../../lib/db/mongo";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const sessionId = String(form.get("sessionId") || "");
  const mime = String(form.get("mime") || (file as File | null)?.type || "application/octet-stream");
  const type = String(form.get("type") || ""); // image | audio

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  if (!type || (type !== "image" && type !== "audio")) {
    return NextResponse.json({ error: "type must be 'image' or 'audio'" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const key = `${sessionId}/${Date.now()}-${crypto.randomUUID()}-${sanitize(file.name)}`;
  await putObject({ key, body: Buffer.from(bytes), contentType: mime });

  const publicUrl = getPublicUrl(key);
  const url = publicUrl ?? (await getSignedUrl(key, 7 * 24 * 3600));

  await recordUpload({
    sessionId,
    key,
    url,
    mime,
    size: file.size,
    createdAt: new Date(),
  });

  return NextResponse.json({ key, url, mime, size: file.size, type });
}

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_");
}


