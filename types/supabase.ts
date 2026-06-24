import type { ApprovalStatus, TranslationStatus } from "@/types/manual";

export type ManualRow = {
  id: string;
  product_name: string;
  brand: string;
  model_name: string | null;
  category: string | null;
  manual_url: string | null;
  file_url: string | null;
  file_path: string | null;
  file_type: string | null;
  file_name: string | null;
  summary_ko: string | null;
  quick_guide: string[] | null;
  troubleshooting: { title: string; solution: string }[] | null;
  translation_status: TranslationStatus | string | null;
  status: ApprovalStatus | string | null;
  contributor_id: string | null;
  contributor_email: string | null;
  contributor_nickname: string | null;
  created_at: string;
};

export type ManualInsert = {
  product_name: string;
  brand: string;
  model_name: string;
  category: string;
  manual_url: string;
  file_url: string | null;
  file_path: string | null;
  file_type: string | null;
  file_name: string | null;
  summary_ko: string;
  quick_guide: string[];
  troubleshooting: { title: string; solution: string }[];
  translation_status: "draft";
  status: "pending";
  contributor_id: string;
  contributor_email: string;
  contributor_nickname: string;
};

export type SuggestionInsert = {
  manual_id: string;
  type: string;
  content: string;
  contributor_id: string;
  contributor_email: string;
  status: "pending";
};
