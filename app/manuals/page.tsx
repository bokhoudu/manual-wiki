"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import ManualCard from "@/components/ManualCard";
import SearchBar from "@/components/SearchBar";
import { useManuals } from "@/components/ManualStore";
import AdBanner from "@/components/AdBanner";

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export default function ManualsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 text-slate-600 sm:px-6 lg:px-8">
          매뉴얼 목록을 불러오는 중입니다.
        </div>
      }
    >
      <ManualsContent />
    </Suspense>
  );
}

function ManualsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { manuals, loading, error, isFallback } = useManuals();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("전체");
  const [brand, setBrand] = useState("전체");

  const categories = useMemo(() => ["전체", ...Array.from(new Set(manuals.map((manual) => manual.category)))], [manuals]);
  const brands = useMemo(() => ["전체", ...Array.from(new Set(manuals.map((manual) => manual.brand)))], [manuals]);

  const filteredManuals = useMemo(() => {
    return manuals.filter((manual) => {
      const matchesQuery =
        query.trim().length === 0 ||
        includesQuery(manual.productName, query) ||
        includesQuery(manual.brand, query) ||
        includesQuery(manual.modelName, query);
      const matchesCategory = category === "전체" || manual.category === category;
      const matchesBrand = brand === "전체" || manual.brand === brand;
      return matchesQuery && matchesCategory && matchesBrand;
    });
  }, [brand, category, manuals, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-wiki-blue">Manuals</p>
        <h1 className="mt-3 text-3xl font-bold text-wiki-ink">매뉴얼 찾기</h1>
        <p className="mt-3 text-slate-600">제품명, 브랜드, 모델명과 필터를 조합해 필요한 문서를 찾아보세요.</p>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-wiki-soft p-4 sm:p-6">
        <SearchBar value={query} onChange={setQuery} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            카테고리 필터
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 outline-none focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            브랜드 필터
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 outline-none focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
            >
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {(error || isFallback) && (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {error ?? "Supabase 연결 전이라 샘플 매뉴얼을 표시하고 있습니다."}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">총 {filteredManuals.length}개 매뉴얼</p>
      </div>

      {loading ? (
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-600">
          매뉴얼을 불러오는 중입니다.
        </div>
      ) : filteredManuals.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredManuals.map((manual) => (
            <ManualCard key={manual.id} manual={manual} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-wiki-ink">검색 결과가 없습니다</h2>
          <p className="mt-2 text-slate-600">검색어를 줄이거나 필터를 전체로 변경해 보세요.</p>
        </div>
      )}
      <AdBanner className="mt-8" slot="manual-list-bottom" />
    </div>
  );
}
