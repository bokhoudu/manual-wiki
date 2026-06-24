import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "manual-files";

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
  return ACCEPTED_MANUAL_FILE_TYPES.includes(file.type as (typeof ACCEPTED_MANUAL_FILE_TYPES)[number]);
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName.trim().replace(/\s+/g, "-");
  return normalized.replace(/[^a-zA-Z0-9가-힣._-]/g, "");
}

function createStoragePath(userId: string, fileName: string) {
  const today = new Date().toISOString().slice(0, 10);
  const randomValue = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  return `${userId}/${today}-${randomValue}-${sanitizeFileName(fileName)}`;
}

export async function uploadManualFile(file: File, userId: string): Promise<ManualFileUploadResult> {
  if (!supabase) {
    throw new Error("Supabase 환경변수가 설정되지 않아 파일을 업로드할 수 없습니다.");
  }

  if (!isAcceptedManualFile(file)) {
    throw new Error("PDF, JPG, PNG, WEBP 파일만 업로드할 수 있습니다.");
  }

  const filePath = createStoragePath(userId, file.name);
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    fileUrl: data.publicUrl,
    filePath,
    fileType: file.type,
    fileName: file.name
  };
}
