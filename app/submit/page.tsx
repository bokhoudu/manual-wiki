"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useManuals } from "@/components/ManualStore";
import { useAuth } from "@/components/AuthProvider";
import type { ManualInput } from "@/types/manual";

type FormState = {
  productName: string;
  brand: string;
  modelName: string;
  category: string;
  manualUrl: string;
  summaryKo: string;
  quickGuide: string;
  troubleshooting: string;
  contributor: string;
};

const initialForm: FormState = {
  productName: "",
  brand: "",
  modelName: "",
  category: "",
  manualUrl: "",
  summaryKo: "",
  quickGuide: "",
  troubleshooting: "",
  contributor: ""
};

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTroubleshooting(value: string) {
  const lines = parseLines(value);
  return lines.map((line) => {
    const [title, ...solutionParts] = line.split(":");
    return {
      title: title.trim(),
      solution: solutionParts.join(":").trim() || "해결 방법을 추가로 확인해야 합니다."
    };
  });
}

export default function SubmitPage() {
  const router = useRouter();
  const { addManual } = useManuals();
  const { user, displayName, loading: authLoading, signInWithGoogle } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (displayName && form.contributor.trim().length === 0) {
      setForm((current) => ({ ...current, contributor: displayName }));
    }
  }, [displayName, form.contributor]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError("로그인한 사용자만 매뉴얼을 등록할 수 있습니다.");
      return;
    }

    setSaving(true);
    setError(null);

    const manual: ManualInput = {
      productName: form.productName,
      brand: form.brand,
      modelName: form.modelName,
      category: form.category,
      manualUrl: form.manualUrl,
      summaryKo: form.summaryKo,
      quickGuide: parseLines(form.quickGuide),
      troubleshooting: parseTroubleshooting(form.troubleshooting),
      contributorId: user.id,
      contributorEmail: user.email ?? "",
      contributorNickname: form.contributor
    };

    try {
      const createdManual = await addManual(manual);
      router.push(`/manuals/${createdManual.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "매뉴얼을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-600 sm:px-6 lg:px-8">
        로그인 상태를 확인하는 중입니다.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-wiki-blue">Submit</p>
        <h1 className="mt-3 text-3xl font-bold text-wiki-ink">로그인이 필요합니다</h1>
        <p className="mt-4 text-slate-600">매뉴얼 등록은 로그인한 사용자만 사용할 수 있습니다.</p>
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="mt-6 min-h-12 rounded-lg bg-wiki-blue px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          Google로 로그인
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-wiki-blue">Submit</p>
        <h1 className="mt-3 text-3xl font-bold text-wiki-ink">매뉴얼 등록하기</h1>
        <p className="mt-3 text-slate-600">등록한 매뉴얼은 Supabase DB에 pending 상태로 저장되고 검토 후 공개 운영에 활용됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-slate-200 bg-wiki-soft p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="제품명" value={form.productName} onChange={(value) => updateField("productName", value)} required />
          <TextField label="브랜드" value={form.brand} onChange={(value) => updateField("brand", value)} required />
          <TextField label="모델명" value={form.modelName} onChange={(value) => updateField("modelName", value)} required />
          <TextField label="카테고리" value={form.category} onChange={(value) => updateField("category", value)} required />
        </div>
        <TextField
          label="원본 매뉴얼 URL"
          type="url"
          value={form.manualUrl}
          onChange={(value) => updateField("manualUrl", value)}
          required
        />
        <TextArea label="한국어 요약" value={form.summaryKo} onChange={(value) => updateField("summaryKo", value)} required />
        <TextArea
          label="빠른 사용법"
          value={form.quickGuide}
          onChange={(value) => updateField("quickGuide", value)}
          placeholder="한 줄에 하나씩 입력하세요"
          required
        />
        <TextArea
          label="오류코드/문제 해결"
          value={form.troubleshooting}
          onChange={(value) => updateField("troubleshooting", value)}
          placeholder="문제 제목: 해결 방법 형식으로 한 줄씩 입력하세요"
          required
        />
        <TextField
          label="등록자 닉네임"
          value={form.contributor}
          onChange={(value) => updateField("contributor", value)}
          required
        />
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="min-h-12 rounded-lg bg-wiki-blue px-6 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            {saving ? "저장 중" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 outline-none transition focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
