import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as presign } from "@aws-sdk/s3-request-presigner";
import { env } from "../env";

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (s3Client) return s3Client;
  
  let endpoint = env.S3_ENDPOINT;
  
  // For R2, ensure endpoint doesn't include bucket name (forcePathStyle will add it)
  if (env.STORAGE_PROVIDER === "R2" && endpoint) {
    // Remove bucket name from endpoint if present (e.g., remove /lolabot from the end)
    endpoint = endpoint.replace(/\/[^\/]+$/, "");
  }
  
  s3Client = new S3Client({
    region: env.S3_REGION || "auto",
    endpoint: env.STORAGE_PROVIDER === "R2" ? endpoint : endpoint || undefined,
    forcePathStyle: env.STORAGE_PROVIDER === "R2" ? true : undefined,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
  return s3Client;
}

export async function putObject(params: { key: string; body: Buffer | Uint8Array | Blob | string; contentType?: string; aclPrivate?: boolean; }): Promise<void> {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: params.key,
    Body: params.body as any,
    ContentType: params.contentType,
    // R2 doesn't support ACLs, so only set it for S3
    ...(env.STORAGE_PROVIDER !== "R2" && params.aclPrivate === false ? { ACL: "public-read" } : {}),
  });
  await client.send(command);
}

export async function deleteObject(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
}

export async function getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key });
  return presign(client, command, { expiresIn: expiresInSeconds });
}

export function getPublicUrl(key: string): string | null {
  if (env.STORAGE_PROVIDER === "R2") {
    // Use R2 public development URL if available, otherwise return null to use signed URLs
    if (env.R2_PUBLIC_URL) {
      // Remove trailing slash if present
      const baseUrl = env.R2_PUBLIC_URL.replace(/\/$/, "");
      return `${baseUrl}/${encodeURIComponent(key)}`;
    }
    return null; // Fallback to signed URLs if no public URL configured
  }
  if (env.S3_REGION) {
    return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${encodeURIComponent(key)}`;
  }
  return null;
}


