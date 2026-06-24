"use client";

type AdBannerProps = {
  slot?: string;
  className?: string;
};

export default function AdBanner({ slot = "manual-wiki-placeholder", className = "" }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div
        className={`flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 ${className}`}
        aria-label="AdSense placeholder"
      >
        광고 영역
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block min-h-24 rounded-lg border border-slate-200 bg-slate-50 ${className}`}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      aria-label="Advertisement"
    />
  );
}
