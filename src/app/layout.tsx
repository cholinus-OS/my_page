import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";

export const metadata: Metadata = {
  title: "관절 척추 관련 정보 | 재활 안내",
  description: "우리 몸의 최적의 상태를 유지하기 위한 재활 운동에 대한 정보를 매일 업데이트합니다.",
  keywords: ["허리디스크 운동", "거북목 교정", "무릎 관절염 재활", "물리치료 스트레칭", "자세 교정"],
  openGraph: {
    title: "관절 척추 관련 정보 | 재활 안내",
    description: "우리 몸의 최적의 상태를 유지하기 위한 재활 운동에 대한 정보를 매일 업데이트합니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://cholinus-exerciseismedicine.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구글 애드센스 ID 가져오기
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://cholinus-exerciseismedicine.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "재활 블로그",
        "item": "https://cholinus-exerciseismedicine.com/blog"
      }
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "관절 척추 재활 정보",
    "url": "https://cholinus-exerciseismedicine.com",
    "description": "우리 몸의 최적의 상태를 유지하기 위한 재활 운동에 대한 정보"
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
