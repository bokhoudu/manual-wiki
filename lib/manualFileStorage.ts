import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "manual-files";
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"] as const;

export const ACCEPTED_MANUAL_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

export type ManualFileUploadResult = {
  fileUrl: string;
  filePath: string;
  fileType: string;
  fileName: string;
};

export function isAcceptedManualFile(file: File) {
  return Boolean(getAllowedExtension(file.name) && isAcceptedMimeType(file.type));
}

function isAcceptedMimeType(mimeType: string) {
  return ACCEPTED_MANUAL_FILE_TYPES.includes(mimeType as (typeof ACCEPTED_MANUAL_FILE_TYPES)[number]);
}

function isExtensionMimeCompatible(extension: string, mimeType: string) {
  const mimeByExtension: Record<(typeof ALLOWED_EXTENSIONS)[number], string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp"
  };

  return mimeByExtension[extension as (typeof ALLOWED_EXTENSIONS)[number]] === mimeType;
}

function getAllowedExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();
  if (!extension) {
    return null;
  }

  return ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number]) ? extension : null;
}

function normalizeStorageExtension(extension: string) {
  return extension === "jpeg" ? "jpg" : extension;
}

function createStoragePath(userId: string, extension: string) {
  const today = new Date().toISOString().slice(0, 10);
  const randomValue = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  return `${userId}/${today}/${randomValue}.${normalizeStorageExtension(extension)}`;
}

export async function uploadManualFile(file: File, userId: string): Promise<ManualFileUploadResult> {
  if (!supabase) {
    throw new Error("Supabase 환경변수가 설정되지 않아 파일을 업로드할 수 없습니다.");
  }

  const extension = getAllowedExtension(file.name);
  if (!extension || !isAcceptedMimeType(file.type) || !isExtensionMimeCompatible(extension, file.type)) {
    throw new Error("PDF, JPG, PNG, WEBP 파일만 업로드할 수 있습니다.");
  }

  const filePath = createStoragePath(userId, extension);

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Supabase Storage upload failed", {
      bucket: BUCKET_NAME,
      path: filePath,
      fileName: file.name,
      fileType: file.type,
      error
    });

    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    throw new Error(`파일 업로드에 실패했습니다. Supabase 오류: ${message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    fileUrl: data.publicUrl,
    filePath,
    fileType: file.type,
    fileName: file.name
  };
}
