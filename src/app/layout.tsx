import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";

export const metadata: Metadata = {
  title: "바른관절 헬프센터 | 척추·관절 재활 운동 가이드",
  description: "허리디스크, 거북목, 무릎 관절염 통증 완화를 위한 전문 물리치료 및 맞춤형 자가 재활 스트레칭 운동 정보를 무료로 확인하세요.",
  keywords: ["허리디스크 운동", "거북목 교정", "무릎 관절염 재활", "물리치료 스트레칭", "자세 교정"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구글 애드센스 ID 가져오기
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="ko" className="h-full">
      <head>
        {/* 구글 애드센스 스크립트 등록 (ID가 설정되어 있는 경우에만 실행됨) */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Header />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 푸터 영역 */}
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 sm:px-6">
            <p className="font-semibold text-slate-700">바른관절 헬프센터</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              본 사이트에서 제공하는 정보는 교육적 및 일반 정보 제공용입니다. 전문 의료인의 진단, 진료 및 치료를 대신할 수 없습니다.<br />
              통증이나 이상 증상이 있을 경우, 반드시 가까운 정형외과나 신경외과 등 전문 의료기관을 방문하시기 바랍니다.
            </p>
            <p className="mt-4 text-xs text-slate-300">
              &copy; {new Date().getFullYear()} 바른관절 헬프센터. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
