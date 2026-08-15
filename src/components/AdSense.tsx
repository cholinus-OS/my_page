"use client";

import React, { useEffect, useRef } from "react";

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
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-6115967537685539";

  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 실제 광고 로드 트리거
    if (typeof window !== "undefined" && adsenseId) {
      try {
        if (insRef.current && insRef.current.getAttribute("data-adsbygoogle-status") !== "done") {
          ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
        }
      } catch (err: unknown) {
        if (err instanceof Error && (err.message.includes("already have ads") || err.message.includes("No slot size"))) {
          // React Strict Mode 또는 초기 렌더링 시 발생하는 알려진 에러 무시
          return;
        }
        console.error("AdSense Error: ", err);
      }
    }
  }, [adsenseId]);

  return (
    <div className="my-6 w-full overflow-hidden flex items-center justify-center rounded-lg">
      <ins
        ref={insRef}
        className="adsbygoogle w-full"
        style={{ display: "block", minWidth: "250px", ...style }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
