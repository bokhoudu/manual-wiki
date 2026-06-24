"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type LoginPanelProps = {
  variant?: "compact" | "full";
};

type BrowserInfo = {
  isInAppBrowser: boolean;
  isAndroid: boolean;
};

const inAppBrowserMessage =
  "카카오톡/인스타그램/네이버앱 내부 브라우저에서는 Google 로그인이 제한될 수 있습니다. 오른쪽 위 메뉴에서 ‘브라우저로 열기’를 눌러 Chrome 또는 Safari에서 로그인해 주세요.";

function detectBrowser(userAgent: string): BrowserInfo {
  const normalized = userAgent.toLowerCase();
  return {
    isInAppBrowser:
      normalized.includes("kakaotalk") ||
      normalized.includes("instagram") ||
      normalized.includes("naver") ||
      normalized.includes("naver(inapp"),
    isAndroid: normalized.includes("android")
  };
}

function createChromeIntentUrl(url: string) {
  const withoutProtocol = url.replace(/^https?:\/\//, "");
  return `intent://${withoutProtocol}#Intent;scheme=${url.startsWith("https://") ? "https" : "http"};package=com.android.chrome;end`;
}

export default function LoginPanel({ variant = "compact" }: LoginPanelProps) {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({ isInAppBrowser: false, isAndroid: false });
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setBrowserInfo(detectBrowser(window.navigator.userAgent));
    setCurrentUrl(window.location.href);
  }, []);

  const chromeIntentUrl = useMemo(() => (currentUrl ? createChromeIntentUrl(currentUrl) : ""), [currentUrl]);

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해 주세요.");
      setMessage(null);
      return;
    }

    setSending(true);
    setError(null);
    setMessage(null);

    try {
      await signInWithEmail(email.trim());
      setMessage("로그인 링크를 이메일로 보냈습니다. 메일함을 확인해 주세요.");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "로그인 링크를 보내지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={variant === "compact" ? "w-full max-w-sm space-y-2" : "mx-auto w-full max-w-md space-y-3"}>
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        className="min-h-11 w-full rounded-md bg-wiki-blue px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Google로 로그인
      </button>

      {browserInfo.isInAppBrowser && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-800">
          <p>{inAppBrowserMessage}</p>
          {browserInfo.isAndroid && chromeIntentUrl && (
            <a
              href={chromeIntentUrl}
              className="mt-2 inline-flex min-h-9 items-center rounded-md bg-amber-600 px-3 text-xs font-bold text-white transition hover:bg-amber-700"
            >
              Chrome으로 열기
            </a>
          )}
          <p className="mt-2 text-amber-700">버튼이 동작하지 않으면 현재 주소를 복사해 Chrome에서 열어 주세요.</p>
        </div>
      )}

      <div className="rounded-md border border-slate-200 bg-white p-3">
        <label className="block text-left text-xs font-semibold text-slate-700">
          이메일 로그인
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            className="mt-2 min-h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-wiki-blue focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <button
          type="button"
          onClick={() => void handleEmailLogin()}
          disabled={sending}
          className="mt-2 min-h-10 w-full rounded-md border border-wiki-blue px-3 text-sm font-semibold text-wiki-blue transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
        >
          {sending ? "발송 중" : "이메일로 로그인 링크 받기"}
        </button>
        {message && <p className="mt-2 text-left text-xs font-medium text-emerald-700">{message}</p>}
        {error && <p className="mt-2 text-left text-xs font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
}
