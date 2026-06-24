"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { useManuals } from "@/components/ManualStore";
import { useAuth } from "@/components/AuthProvider";
import type { SuggestionType } from "@/types/manual";

const emptyText = "아직 등록된 내용이 없습니다";

function isImageFile(fileType: string | null) {
  return fileType?.startsWith("image/") ?? false;
}

function isPdfFile(fileType: string | null) {
  return fileType === "application/pdf";
}

function displayValue(value: string) {
  return value.trim() || emptyText;
}

export default function ManualDetailPage() {
  const params = useParams<{ id: string }>();
  const { manuals, loading, createSuggestion } = useManuals();
  const { user, signInWithGoogle } = useAuth();
  const [suggestionType, setSuggestionType] = useState<SuggestionType | null>(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const manual = manuals.find((item) => item.id === params.id);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600 sm:px-6 lg:px-8">
        매뉴얼을 불러오는 중입니다.
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-wiki-ink">매뉴얼을 찾을 수 없습니다</h1>
        <p className="mt-3 text-slate-600">삭제되었거나 아직 등록되지 않은 문서입니다.</p>
        <Link
          href="/manuals"
          className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-wiki-blue px-5 font-semibold text-white transition hover:bg-blue-700"
        >
          매뉴얼 목록으로 이동
        </Link>
      </div>
    );
  }

  const requireLoginOrOpen = (type: SuggestionType) => {
    if (!user) {
      setMessage("로그인한 사용자만 수정 제안과 오번역 제보를 할 수 있습니다.");
      return;
    }
    setSuggestionType(type);
    setContent("");
    setMessage(null);
  };

  const submitSuggestion = async () => {
    if (!user || !suggestionType || content.trim().length === 0) {
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await createSuggestion({
        manualId: manual.id,
        type: suggestionType,
        content: content.trim(),
        contributorId: user.id,
        contributorEmail: user.email ?? ""
      });
      setMessage("제안이 접수되었습니다. 검토 후 반영됩니다.");
      setSuggestionType(null);
      setContent("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "제안을 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={manual.translationStatus} />
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            원문 정보 등록
          </span>
          {manual.summaryKo.trim() && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              한국어 요약 있음
            </span>
          )}
          {manual.translationStatus === "review" && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              번역 검수 필요
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-wiki-ink">{manual.productName}</h1>
        <p className="mt-4 text-lg text-slate-600">
          {displayValue(manual.brand)} / {displayValue(manual.modelName)} / {displayValue(manual.category)}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {manual.manualUrl ? (
            <a
              href={manual.manualUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-lg bg-wiki-blue px-4 font-semibold text-white transition hover:bg-blue-700"
            >
              매뉴얼 원문 링크
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-500">
              원문 URL 없음
            </span>
          )}
          <button
            type="button"
            onClick={() => requireLoginOrOpen("translation_report")}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 font-semibold text-slate-700 transition hover:border-wiki-blue hover:bg-blue-50 hover:text-wiki-blue"
          >
            오번역 제보
          </button>
          <button
            type="button"
            onClick={() => requireLoginOrOpen("edit_suggestion")}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 font-semibold text-slate-700 transition hover:border-wiki-blue hover:bg-blue-50 hover:text-wiki-blue"
          >
            수정 제안
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {message && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
              {message}{" "}
              {!user && (
                <button type="button" onClick={() => void signInWithGoogle()} className="font-bold underline">
                  Google로 로그인
                </button>
              )}
            </p>
          )}
          {suggestionType && (
            <div className="rounded-lg border border-slate-200 bg-wiki-soft p-4">
              <label className="block text-sm font-semibold text-slate-700">
                {suggestionType === "translation_report" ? "오번역 제보 내용" : "수정 제안 내용"}
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSuggestionType(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-white"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => void submitSuggestion()}
                  disabled={submitting || content.trim().length === 0}
                  className="rounded-lg bg-wiki-blue px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  접수하기
                </button>
              </div>
            </div>
          )}
        </div>

        {manual.fileUrl && (
          <section className="mt-6 rounded-lg border border-slate-200 bg-wiki-soft p-4">
            <h2 className="text-lg font-bold text-wiki-ink">업로드된 매뉴얼 파일</h2>
            <p className="mt-1 text-sm text-slate-600">{manual.fileName ?? "manual file"}</p>
            {isImageFile(manual.fileType) && (
              <a href={manual.fileUrl} target="_blank" rel="noreferrer" className="mt-4 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={manual.fileUrl}
                  alt={manual.fileName ?? manual.productName}
                  className="max-h-[520px] w-full rounded-lg border border-slate-200 object-contain"
                />
              </a>
            )}
            {isPdfFile(manual.fileType) && (
              <a
                href={manual.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-wiki-blue px-4 font-semibold text-white transition hover:bg-blue-700"
              >
                PDF 보기/다운로드
              </a>
            )}
          </section>
        )}
      </div>

      <div className="prose prose-slate mt-8 max-w-none">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-wiki-ink">한국어 요약</h2>
          <p className="mt-4 leading-8 text-slate-700">{displayValue(manual.summaryKo)}</p>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-wiki-ink">목차</h2>
          {manual.quickGuide.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {manual.quickGuide.map((item, index) => (
                <li key={item} className="flex gap-3 leading-7 text-slate-700">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-wiki-blue">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 leading-8 text-slate-700">{emptyText}</p>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-wiki-ink">주요문제 해결방법</h2>
          {manual.troubleshooting.length > 0 ? (
            <div className="mt-4 divide-y divide-slate-200">
              {manual.troubleshooting.map((item) => (
                <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-lg font-bold text-wiki-ink">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-700">{displayValue(item.solution)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 leading-8 text-slate-700">{emptyText}</p>
          )}
        </section>
      </div>
    </article>
  );
}
