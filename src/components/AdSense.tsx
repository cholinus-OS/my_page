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
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-6115967537685539";

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

  return (
    <div className="my-6 overflow-hidden min-h-[50px] flex items-center justify-center">
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
