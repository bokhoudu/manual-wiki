export type TranslationStatus = "none" | "draft" | "review" | "complete";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Manual = {
  id: string;
  productName: string;
  brand: string;
  modelName: string;
  category: string;
  manualUrl: string;
  summaryKo: string;
  quickGuide: string[];
  troubleshooting: {
    title: string;
    solution: string;
  }[];
  translationStatus: TranslationStatus;
  status: ApprovalStatus;
  createdAt: string;
  contributor: string;
  contributorId: string | null;
  contributorEmail: string | null;
  contributorNickname: string | null;
};

export type ManualInput = {
  productName: string;
  brand: string;
  modelName: string;
  category: string;
  manualUrl: string;
  summaryKo: string;
  quickGuide: string[];
  troubleshooting: {
    title: string;
    solution: string;
  }[];
  contributorId: string;
  contributorEmail: string;
  contributorNickname: string;
};

export type SuggestionType = "translation_report" | "edit_suggestion";

export type SuggestionInput = {
  manualId: string;
  type: SuggestionType;
  content: string;
  contributorId: string;
  contributorEmail: string;
};
