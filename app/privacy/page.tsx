export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-wiki-ink">개인정보처리방침</h1>
      <div className="mt-6 space-y-4 leading-8 text-slate-700">
        <p>Manual Wiki는 Google 로그인과 매뉴얼 등록 기능 제공을 위해 Supabase Auth에서 제공하는 사용자 ID, 이메일, 닉네임 정보를 처리합니다.</p>
        <p>수집된 정보는 매뉴얼 등록자 표시, 수정 제안 및 오번역 제보 이력 관리, 악용 방지 목적으로 사용됩니다.</p>
        <p>서비스는 Supabase와 Vercel 등 배포 및 인증 인프라 제공자의 보안 기능을 활용합니다.</p>
        <p>개인정보 삭제 또는 문의가 필요한 경우 문의 페이지를 통해 요청할 수 있습니다.</p>
      </div>
    </article>
  );
}
