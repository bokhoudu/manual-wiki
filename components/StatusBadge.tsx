import type { TranslationStatus } from "@/types/manual";

const statusMap: Record<TranslationStatus, { label: string; className: string }> = {
  none: {
    label: "번역 없음",
    className: "border-slate-300 bg-slate-50 text-slate-600"
  },
  draft: {
    label: "초안",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  review: {
    label: "검수 필요",
    className: "border-blue-200 bg-blue-50 text-blue-700"
  },
  complete: {
    label: "번역 완료",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  }
};

export default function StatusBadge({ status }: { status: TranslationStatus }) {
  const statusInfo = statusMap[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}>
      {statusInfo.label}
    </span>
  );
}
