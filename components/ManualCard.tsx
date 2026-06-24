import Link from "next/link";
import type { Manual } from "@/types/manual";
import StatusBadge from "@/components/StatusBadge";

export default function ManualCard({ manual }: { manual: Manual }) {
  return (
    <Link
      href={`/manuals/${manual.id}`}
      className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-wiki"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-wiki-blue">{manual.brand}</p>
          <h3 className="mt-1 text-lg font-bold leading-snug text-wiki-ink group-hover:text-wiki-blue">
            {manual.productName}
          </h3>
        </div>
        <StatusBadge status={manual.translationStatus} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">모델명</dt>
          <dd className="mt-1 font-medium text-slate-800">{manual.modelName}</dd>
        </div>
        <div>
          <dt className="text-slate-500">카테고리</dt>
          <dd className="mt-1 font-medium text-slate-800">{manual.category}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">등록일</dt>
          <dd className="mt-1 font-medium text-slate-800">{manual.createdAt}</dd>
        </div>
      </dl>
    </Link>
  );
}
