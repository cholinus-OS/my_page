"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

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
        body: JSON.stringify({ email }),
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
    <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          통증 없는 일상을 위한 매주 5분 재활 레터
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-md">
          정형외과 전문의가 직접 엄선한 부위별 재활 스트레칭 가이드와 최신 의학 정보를 매주 금요일 이메일로 보내드립니다.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center rounded-2xl bg-teal-50 px-6 py-4 border border-teal-100 w-full max-w-md">
            <CheckCircle className="h-6 w-6 text-teal-600 mb-2" />
            <p className="font-semibold text-teal-800">구독 신청이 완료되었습니다!</p>
            <p className="text-xs text-teal-600 mt-1">입력하신 이메일로 유익한 정보를 보내드릴게요.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 sm:h-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 font-bold text-white transition hover:bg-teal-700 disabled:opacity-70"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "구독하기"
                )}
              </button>
            </div>
            
            {/* 법적 필수 동의 항목 (개인정보 보호법 준수) */}
            <div className="mt-4 flex items-start gap-2 text-left bg-white p-3 rounded-lg border border-slate-100">
              <input 
                type="checkbox" 
                id="privacy-consent" 
                required 
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
              />
              <label htmlFor="privacy-consent" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer">
                <strong>(필수) 개인정보 수집 및 이용 동의</strong><br/>
                뉴스레터 발송을 위해 이메일 주소를 수집하며, 구독 해지 시까지 안전하게 보관 후 파기합니다. 동의를 거부할 권리가 있으나, 거부 시 뉴스레터를 받으실 수 없습니다.
              </label>
            </div>

            {status === "error" && (
              <p className="mt-2 text-xs text-rose-500 text-left pl-2">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
