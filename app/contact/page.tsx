export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-wiki-ink">문의</h1>
      <div className="mt-6 space-y-4 leading-8 text-slate-700">
        <p>서비스 운영, 개인정보, 저작권 신고, 제휴 관련 문의를 받을 수 있는 페이지입니다.</p>
        <p>배포 시 운영 이메일 또는 고객지원 폼 URL을 이 영역에 연결하세요.</p>
        <p className="rounded-lg border border-slate-200 bg-wiki-soft px-4 py-3 font-medium text-slate-800">
          contact@manual-wiki.example.com
        </p>
      </div>
    </article>
  );
}
