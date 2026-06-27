import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import Link from "next/link";

export const metadata: Metadata = {
  title: "관절 척추 관련 정보 | 재활 안내",
  description: "우리 몸의 최적의 상태를 유지하기 위한 재활 운동에 대한 정보를 매일 업데이트합니다.",
  keywords: ["허리디스크 운동", "거북목 교정", "무릎 관절염 재활", "물리치료 스트레칭", "자세 교정"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "관절 척추 관련 정보 | 재활 안내",
    description: "우리 몸의 최적의 상태를 유지하기 위한 재활 운동에 대한 정보를 매일 업데이트합니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://cholinus-exerciseismedicine.com",
  },
  verification: {
    other: {
      "naver-site-verification": ["99442813d39bc5e4084de2796dd65657c2226df7"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구글 애드센스 및 애널리틱스 ID 가져오기 (배포 빌드 환경변수 누락 대비 백업 기본값 설정)
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-6115967537685539";
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-Z0MJR1HV78";

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
        {/* 구글 애드센스 스크립트 등록 (네이티브 script 태그로 구글 크롤러 소유권 확인율 극대화) */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        {/* 구글 애널리틱스 (GA4) 스크립트 등록 */}
        {gaId && gaId !== "나중에_입력" && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
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
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 sm:px-6 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="바른관절 헬프센터 로고" className="h-10 w-10 object-contain mb-3" />
            <p className="font-semibold text-slate-700">바른관절 헬프센터</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              본 사이트에서 제공하는 정보는 교육적 및 일반 정보 제공용입니다. 전문 의료인의 진단, 진료 및 치료를 대신할 수 없습니다.<br />
              통증이나 이상 증상이 있을 경우, 반드시 가까운 정형외과나 신경외과 등 전문 의료기관을 방문하시기 바랍니다.
            </p>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs font-semibold text-slate-400">
              <Link href="/privacy" className="hover:text-teal-600 transition hover:underline">
                개인정보처리방침
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/terms" className="hover:text-teal-600 transition hover:underline">
                이용약관
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-300">
              &copy; {new Date().getFullYear()} 바른관절 헬프센터. All rights reserved.
            </p>
          </div>
        </footer>

        <Chatbot />
      </body>
    </html>
  );
}
