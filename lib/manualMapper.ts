import type { Manual, ManualInput, SuggestionInput } from "@/types/manual";
import type { ManualInsert, ManualRow, SuggestionInsert } from "@/types/supabase";

function normalizeTranslationStatus(value: string | null | undefined): Manual["translationStatus"] {
  if (value === "none" || value === "draft" || value === "review" || value === "complete") {
    return value;
  }
  return "draft";
}

function normalizeApprovalStatus(value: string | null | undefined): Manual["status"] {
  if (value === "pending" || value === "approved" || value === "rejected") {
    return value;
  }
  return "pending";
}

export function mapManualRow(row: ManualRow): Manual {
  return {
    id: row.id,
    productName: row.product_name,
    brand: row.brand,
    modelName: row.model_name ?? "",
    category: row.category ?? "",
    manualUrl: row.manual_url ?? "",
    fileUrl: row.file_url,
    filePath: row.file_path,
    fileType: row.file_type,
    fileName: row.file_name,
    summaryKo: row.summary_ko ?? "",
    quickGuide: row.quick_guide ?? [],
    troubleshooting: row.troubleshooting ?? [],
    translationStatus: normalizeTranslationStatus(row.translation_status),
    status: normalizeApprovalStatus(row.status),
    createdAt: row.created_at.slice(0, 10),
    contributor: row.contributor_nickname ?? row.contributor_email ?? "anonymous",
    contributorId: row.contributor_id,
    contributorEmail: row.contributor_email,
    contributorNickname: row.contributor_nickname
  };
}

export function mapManualInput(input: ManualInput): ManualInsert {
  return {
    product_name: input.productName,
    brand: input.brand,
    model_name: input.modelName,
    category: input.category,
    manual_url: input.manualUrl,
    file_url: input.fileUrl,
    file_path: input.filePath,
    file_type: input.fileType,
    file_name: input.fileName,
    summary_ko: input.summaryKo,
    quick_guide: input.quickGuide,
    troubleshooting: input.troubleshooting,
    translation_status: "draft",
    status: "pending",
    contributor_id: input.contributorId,
    contributor_email: input.contributorEmail,
    contributor_nickname: input.contributorNickname
  };
}

export function mapSuggestionInput(input: SuggestionInput): SuggestionInsert {
  return {
    manual_id: input.manualId,
    type: input.type,
    content: input.content,
    contributor_id: input.contributorId,
    contributor_email: input.contributorEmail,
    status: "pending"
  };
}
