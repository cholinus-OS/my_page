"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // If they just dismiss without accepting, we can also hide it temporarily or permanently.
    // Let's store a dismissed state so it doesn't annoy them constantly.
    localStorage.setItem("cookieConsent", "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-20 sm:pb-6 pointer-events-none">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Cookie className="h-4 w-4 text-teal-600 sm:hidden" />
              쿠키 수집 및 개인정보 보호 안내
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              본 웹사이트는 사용자 경험을 향상시키고 트래픽을 분석하며 개인화된 콘텐츠 및 광고를 제공하기 위해 쿠키를 사용합니다. 
              사이트를 계속 이용하시면 쿠키 사용에 동의하시는 것으로 간주됩니다. 자세한 내용은{" "}
              <Link href="/privacy/" className="text-teal-600 underline hover:text-teal-800">
                개인정보처리방침
              </Link>
              을 확인해 주세요.
            </p>
          </div>
        </div>
        
        <div className="flex shrink-0 items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-teal-700 shadow-md shadow-teal-600/20"
          >
            동의합니다
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
