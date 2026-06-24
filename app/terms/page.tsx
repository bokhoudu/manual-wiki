import type { ReactNode } from "react";

export default function TermsPage() {
  return (
    <LegalPage title="이용약관">
      <p>Manual Wiki는 제품 매뉴얼 정보를 검색, 열람, 등록할 수 있도록 돕는 커뮤니티 기반 서비스입니다.</p>
      <p>사용자는 본인이 제출할 권한이 있는 정보만 등록해야 하며, 허위 정보나 타인의 권리를 침해하는 콘텐츠를 올릴 수 없습니다.</p>
      <p>등록된 매뉴얼 요약과 제안은 운영 검토를 거쳐 수정, 보류, 삭제될 수 있습니다.</p>
      <p>서비스는 안정적인 제공을 위해 노력하지만, 정보의 완전성이나 특정 목적 적합성을 보증하지 않습니다.</p>
    </LegalPage>
  );
}

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-wiki-ink">{title}</h1>
      <div className="mt-6 space-y-4 leading-8 text-slate-700">{children}</div>
    </article>
  );
}
