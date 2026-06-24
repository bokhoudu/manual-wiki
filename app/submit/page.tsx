"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useManuals } from "@/components/ManualStore";
import { useAuth } from "@/components/AuthProvider";
import { isAcceptedManualFile, uploadManualFile } from "@/lib/manualFileStorage";
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

const categoryOptions = [
  "생활가전",
  "주방가전",
  "전자기기",
  "오디오",
  "카메라",
  "공구",
  "컴퓨터/주변기기",
  "게임기",
  "자동차용품",
  "기타"
];

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
  return parseLines(value).map((line) => {
    const [title, ...solutionParts] = line.split(":");
    return {
      title: title.trim(),
      solution: solutionParts.join(":").trim()
    };
  });
}

export default function SubmitPage() {
  const router = useRouter();
  const { addManual } = useManuals();
  const { user, displayName, loading: authLoading, signInWithGoogle } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [manualFile, setManualFile] = useState<File | null>(null);
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

    if (!form.manualUrl.trim() && !manualFile) {
      setError("매뉴얼 URL 또는 파일 중 하나는 입력해 주세요.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let uploadedFile: Pick<ManualInput, "fileUrl" | "filePath" | "fileType" | "fileName"> = {
        fileUrl: null,
        filePath: null,
        fileType: null,
        fileName: null
      };

      if (manualFile) {
        try {
          uploadedFile = await uploadManualFile(manualFile, user.id);
        } catch (uploadError) {
          console.error("Manual file upload failed during submit", uploadError);

          if (!form.manualUrl.trim()) {
            throw uploadError;
          }
        }
      }

      const manual: ManualInput = {
        productName: form.productName.trim(),
        brand: form.brand.trim(),
        modelName: form.modelName.trim(),
        category: form.category,
        manualUrl: form.manualUrl.trim(),
        fileUrl: uploadedFile.fileUrl,
        filePath: uploadedFile.filePath,
        fileType: uploadedFile.fileType,
        fileName: uploadedFile.fileName,
        summaryKo: form.summaryKo.trim(),
        quickGuide: parseLines(form.quickGuide),
        troubleshooting: parseTroubleshooting(form.troubleshooting),
        contributorId: user.id,
        contributorEmail: user.email ?? "",
        contributorNickname: form.contributor.trim() || displayName || user.email || "익명"
      };

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
        <p className="mt-3 text-slate-600">
          제품명과 모델명을 입력하고, 원본 URL 또는 파일 중 하나를 등록해 주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-slate-200 bg-wiki-soft p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="제품명" value={form.productName} onChange={(value) => updateField("productName", value)} required />
          <TextField label="모델명" value={form.modelName} onChange={(value) => updateField("modelName", value)} required />
          <TextField label="브랜드" value={form.brand} onChange={(value) => updateField("brand", value)} />
          <label className="block text-sm font-semibold text-slate-700">
            카테고리
            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 outline-none transition focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
            >
              <option value="">선택 안 함</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <TextField
          label="원본 매뉴얼 URL"
          type="url"
          value={form.manualUrl}
          onChange={(value) => updateField("manualUrl", value)}
        />

        <label className="block text-sm font-semibold text-slate-700">
          파일 업로드
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0] ?? null;
              if (selectedFile && !isAcceptedManualFile(selectedFile)) {
                setError("PDF, JPG, PNG, WEBP 파일만 업로드할 수 있습니다.");
                setManualFile(null);
                event.target.value = "";
                return;
              }
              setError(null);
              setManualFile(selectedFile);
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-wiki-blue hover:file:bg-blue-100"
          />
          <span className="mt-2 block text-xs font-normal text-slate-500">
            PDF, JPG, PNG, WEBP 파일을 업로드할 수 있습니다. 파일명은 원본 그대로 저장되지만 Storage 경로에는 사용하지 않습니다.
          </span>
        </label>

        <TextArea label="한국어 요약" value={form.summaryKo} onChange={(value) => updateField("summaryKo", value)} />
        <TextArea
          label="목차"
          value={form.quickGuide}
          onChange={(value) => updateField("quickGuide", value)}
          placeholder="한 줄에 하나씩 입력하세요"
        />
        <TextArea
          label="주요문제 해결방법"
          value={form.troubleshooting}
          onChange={(value) => updateField("troubleshooting", value)}
          placeholder="문제 제목: 해결 방법 형식으로 한 줄씩 입력하세요"
        />
        <TextField label="등록자 닉네임" value={form.contributor} onChange={(value) => updateField("contributor", value)} />

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="min-h-12 rounded-lg bg-wiki-blue px-6 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
