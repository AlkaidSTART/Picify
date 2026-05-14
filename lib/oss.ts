import fs from "node:fs";
import path from "node:path";

const GENERATED_DIR = path.join(process.cwd(), "public", "generated");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export interface PresignResult {
  uploadUrl: string;
  ossKey: string;
}

export async function generatePresignUrl(
  userId: string,
  filename: string,
  contentType: string,
): Promise<PresignResult> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "png";
  const ossKey = `uploads/${userId}/${Date.now()}.${ext}`;

  if (process.env.OSS_ACCESS_KEY && process.env.OSS_SECRET_KEY) {
    return generateOssPresignUrl(ossKey, contentType);
  }

  return {
    uploadUrl: `/api/v1/oss/upload?ossKey=${encodeURIComponent(ossKey)}`,
    ossKey,
  };
}

export async function uploadToOSS(
  ossKey: string,
  buffer: Buffer,
): Promise<string> {
  const cdnBase = process.env.NEXT_PUBLIC_OSS_CDN;

  if (process.env.OSS_ACCESS_KEY && process.env.OSS_SECRET_KEY && cdnBase) {
    return uploadToAliyunOSS(ossKey, buffer);
  }

  const filePath = path.join(process.cwd(), "public", ossKey);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
  return `/${ossKey}`;
}

export async function uploadToLocal(
  ossKey: string,
  buffer: Buffer,
): Promise<string> {
  const filePath = path.join(GENERATED_DIR, ossKey);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
  return `/${ossKey}`;
}

async function generateOssPresignUrl(
  ossKey: string,
  _contentType: string,
): Promise<PresignResult> {
  void ossKey;
  throw new Error("阿里云 OSS 预签名暂未实现，请配置本地存储或等待 OSS 接入");
}

async function uploadToAliyunOSS(
  ossKey: string,
  _buffer: Buffer,
): Promise<string> {
  void ossKey;
  throw new Error("阿里云 OSS 上传暂未实现，请配置本地存储或等待 OSS 接入");
}
