"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "구독 중 오류가 발생했습니다.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-3 sm:mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 break-keep">
          통증 없는 일상을 위한 매주 5분 재활 레터
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 max-w-md break-keep leading-relaxed">
          정형외과 전문의가 직접 엄선한 부위별 재활 스트레칭 가이드와 최신 의학 정보를 매주 화요일 아침 이메일로 보내드립니다.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center rounded-2xl bg-teal-50 px-5 py-4 border border-teal-100 w-full max-w-md">
            <CheckCircle className="h-6 w-6 text-teal-600 mb-2" />
            <p className="font-semibold text-teal-800 text-sm sm:text-base">구독 신청이 완료되었습니다!</p>
            <p className="text-xs text-teal-600 mt-1">입력하신 이메일로 매주 화요일 유익한 소식을 전해드릴게요.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                autoComplete="email"
                enterKeyHint="send"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 sm:h-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 font-bold text-white transition active:scale-[0.98] hover:bg-teal-700 disabled:opacity-70 shadow-sm"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "구독하기"
                )}
              </button>
            </div>
            
            {/* 법적 필수 동의 항목 (개인정보 보호법 준수) - 모바일 터치 영역 최적화 */}
            <label 
              htmlFor="privacy-consent" 
              className="mt-3 sm:mt-4 flex items-start gap-2.5 text-left bg-white/90 p-3 sm:p-3.5 rounded-xl border border-slate-100 cursor-pointer select-none transition hover:bg-white active:bg-slate-50"
            >
              <input 
                type="checkbox" 
                id="privacy-consent" 
                required 
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">(필수) 개인정보 수집 및 이용 동의</strong><br/>
                뉴스레터 발송을 위해 이메일 주소를 수집하며, 구독 해지 시까지 안전하게 보관 후 파기합니다. 동의를 거부할 권리가 있으나, 거부 시 뉴스레터를 받으실 수 없습니다.
              </span>
            </label>

            {status === "error" && (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-left border border-rose-100">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-600">{errorMessage}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

