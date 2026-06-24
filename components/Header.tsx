"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LoginPanel from "@/components/LoginPanel";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/manuals", label: "매뉴얼 찾기" },
  { href: "/submit", label: "매뉴얼 등록" }
];

export default function Header() {
  const { user, displayName, loading, signOut } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-wiki-ink">
          Manual <span className="text-wiki-blue">Wiki</span>
        </Link>
        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 transition hover:bg-blue-50 hover:text-wiki-blue"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              {loading ? (
                <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-500">세션 확인 중</span>
              ) : user ? (
                <>
                  <span className="max-w-56 truncate rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-wiki-blue hover:bg-blue-50 hover:text-wiki-blue"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen((current) => !current)}
                  className="rounded-md bg-wiki-blue px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
          {!loading && !user && loginOpen && <LoginPanel />}
        </div>
      </div>
    </header>
  );
}
