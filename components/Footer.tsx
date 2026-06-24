export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Manual Wiki MVP</p>
          <p>제품 매뉴얼을 더 쉽게 찾고 읽기 위한 커뮤니티 위키</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <a href="/terms" className="hover:text-wiki-blue">이용약관</a>
          <a href="/privacy" className="hover:text-wiki-blue">개인정보처리방침</a>
          <a href="/copyright" className="hover:text-wiki-blue">저작권 신고</a>
          <a href="/contact" className="hover:text-wiki-blue">문의</a>
        </nav>
      </div>
    </footer>
  );
}
