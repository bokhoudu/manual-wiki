"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ManualCard from "@/components/ManualCard";
import SearchBar from "@/components/SearchBar";
import { useManuals } from "@/components/ManualStore";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  const router = useRouter();
  const { manuals, loading, error, isFallback } = useManuals();
  const [query, setQuery] = useState("");

  const popularManuals = manuals.slice(0, 6);
  const recentManuals = useMemo(
    () => [...manuals].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [manuals]
  );

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-wiki-soft">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-wiki-blue">Manual Wiki</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-wiki-ink sm:text-5xl">
              제품 매뉴얼을 검색하고 한국어로 빠르게 이해하세요
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              흩어진 원문 매뉴얼, 요약, 빠른 사용법, 문제 해결 정보를 제품별 문서로 정리하는 위키형 MVP입니다.
            </p>
          </div>
          <div className="mt-8 max-w-4xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => router.push(`/manuals?q=${encodeURIComponent(query)}`)}
            />
          </div>
          <div className="mt-6">
            <Link
              href="/submit"
              className="inline-flex min-h-12 items-center rounded-lg border border-wiki-blue bg-white px-5 font-semibold text-wiki-blue transition hover:bg-blue-50"
            >
              매뉴얼 등록하기
            </Link>
          </div>
          {(error || isFallback) && (
            <p className="mt-5 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error ?? "Supabase 연결 전이라 샘플 매뉴얼을 표시하고 있습니다."}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-wiki-blue">Popular</p>
            <h2 className="mt-2 text-2xl font-bold text-wiki-ink">인기 매뉴얼</h2>
          </div>
          <Link href="/manuals" className="text-sm font-semibold text-wiki-blue hover:text-blue-700">
            전체 보기
          </Link>
        </div>
        {loading ? (
          <p className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">매뉴얼을 불러오는 중입니다.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularManuals.map((manual) => (
              <ManualCard key={manual.id} manual={manual} />
            ))}
          </div>
        )}
        <AdBanner className="mt-8" slot="home-popular" />
      </section>

      <section className="border-y border-slate-200 bg-wiki-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-wiki-blue">Recent</p>
            <h2 className="mt-2 text-2xl font-bold text-wiki-ink">최근 등록된 매뉴얼</h2>
            <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {recentManuals.map((manual) => (
                <Link
                  key={manual.id}
                  href={`/manuals/${manual.id}`}
                  className="flex flex-col gap-2 p-4 transition hover:bg-blue-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-wiki-ink">{manual.productName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {manual.brand} · {manual.modelName}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{manual.createdAt}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-wiki-blue">About</p>
            <h2 className="mt-2 text-2xl font-bold text-wiki-ink">서비스 설명</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Manual Wiki는 제품명, 브랜드, 모델명 중심으로 매뉴얼을 찾고, 긴 원문을 한국어 요약과 실사용 중심의
              빠른 가이드로 다시 정리합니다. MVP 단계에서는 로컬 mock data와 브라우저 저장소를 사용해 등록 흐름을
              검증합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
