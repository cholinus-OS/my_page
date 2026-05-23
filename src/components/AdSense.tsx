"use client";

import { useEffect } from "react";

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: string;
}

export default function AdSense({
  slot,
  style = { display: "block" },
  format = "auto",
  responsive = "true",
}: AdSenseProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // 실제 광고 로드 트리거
    if (typeof window !== "undefined" && adsenseId) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense Error: ", err);
      }
    }
  }, [adsenseId]);

  // 광고 ID가 설정되지 않은 개발 모드나 로컬 환경에서는 보기 좋게 가이드라인 박스를 그려줍니다.
  if (!adsenseId) {
    return (
      <div className="adsense-placeholder my-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">구글 애드센스 광고 영역</div>
        <p className="mt-1 text-[11px] text-slate-400">
          (광고 ID: <code className="bg-slate-200 px-1 py-0.5 rounded">NEXT_PUBLIC_ADSENSE_ID</code>를 채우면 실제 광고가 나옵니다.)
        </p>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
