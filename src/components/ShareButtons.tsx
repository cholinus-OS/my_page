"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title?: string;
  text?: string;
  url?: string;
}

export default function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanShare(true);
    }
  }, []);

  const shareData = {
    title: title || "바른관절 헬프센터",
    text: text || "유용한 관절 재활 정보를 확인해보세요!",
    url: url || (typeof window !== "undefined" ? window.location.href : ""),
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("공유가 취소되었거나 지원되지 않습니다.", error);
      }
    }
  };

  const handleCopy = async () => {
    try {
      const shareUrl = shareData.url;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("링크 복사 실패:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {canShare && (
        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] px-5 py-2.5 text-sm font-bold text-[#191919] transition duration-200 shadow-sm border border-[#FEE500]/20"
        >
          {/* 카카오 심볼을 연상시키는 아이콘 대신 일반 공유 아이콘 사용 (네이티브 공유 호출) */}
          <Share2 className="h-4 w-4" />
          카카오톡 등 공유하기
        </button>
      )}
      
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition duration-200 shadow-sm border border-slate-200"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-teal-600" />
            복사 완료!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            링크 복사
          </>
        )}
      </button>
    </div>
  );
}
